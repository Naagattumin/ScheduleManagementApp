# pylint: disable=logging-fstring-interpolation

from sqlalchemy import create_engine, Column, String, Integer, TIMESTAMP, func
from sqlalchemy.orm import declarative_base
# from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session

from pydantic import BaseModel

from fastapi import FastAPI, HTTPException
from starlette.middleware.cors import CORSMiddleware

import logging
logging = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG, format="🐾%(asctime)s [%(levelname)s] %(pathname)s %(lineno)d %(funcName)s| %(message)s", datefmt="%y%m%d_%H%M%S")
logger = logging

from typing import List

import datetime
logger.debug(f"backendの時刻確認: {datetime.datetime.now()}")##########


# db-------------------------------

# 接続したいDBの基本情報を設定
user_name = "user"
password = "password"
host = "db"  # docker-composeで定義したMySQLのサービス名
database_name = "sample_db"

# f""みたいな構文。DBの接続情報を設定の文字列を作る。
# mysql://<ユーザー名>:<パスワード>@<ホスト>/<データベース名>?charset=utf8
# sqliteなら　'sqlite:///sample.db'（相対パス）とか書くらしい
# user_name, password, host, database_nameは、上で設定したもの。
DATABASE = 'mysql://%s:%s@%s/%s?charset=utf8mb4' % (
    user_name,
    password,
    host,
    database_name,
)

# # DBとの接続
# # 多分、ENGINE：接続用のインスタンス
# ENGINE = create_engine(
#     DATABASE,
#     # encoding="utf-8",
#     echo=True
# )


# .connect()が成功しなかったら、5秒待ってリトライする。5回リトライしてもダメだったらエラーを出す。
# 多分、DBが立ち上がる前にアクセスしようとして失敗してた。それをリトライしてる。
from sqlalchemy.exc import OperationalError
import time


def create_engine_with_retry(url, retries=5, delay=5):
    for _ in range(retries):
        try:
            engine = create_engine(url, echo=True)
            tmpTestConnection = engine.connect()
            return engine
        except OperationalError:
            logger.warning(f"!!!Connection failed, retrying in {delay} seconds...")
            time.sleep(delay)
    logger.error("Failed to connect to the database after several attempts")
    raise OperationalError("!!!Failed to connect to the database after several attempts", params=None, orig=None)


ENGINE = create_engine_with_retry(DATABASE)

# Sessionの作成
# sessionは、SQLAlchemyを使用してデータベースとの対話を管理するためのオブジェクトです。具体的には、データベースへのクエリの実行、トランザクションの管理、データの追加・更新・削除などの操作を行います。

# scoped_sessionはスレッドセーフなセッションを提供するために使用されます。これにより、異なるスレッドが同じセッションを共有することなく、独立したセッションを持つことができます。
session = scoped_session(
    # ORM実行時の設定。
    sessionmaker(
        # 自動コミットしない
        autocommit=False,
        # 自動的にデータベースに変更を反映しない
        autoflush=False,
        # データベースエンジンを指定
        bind=ENGINE
    )
)

# modelで使用する
Base = declarative_base()
# DB接続用のセッションクラス、インスタンスが作成されると接続する
# 多分おまじない
Base.query = session.query_property()


# model-------------------------------

# ScheduleManagementApp\mysql\initdb.d\schema.sql でも定義してるけど、mysqlを使うときはここでも定義する必要がある。向こうが必要かは謎。写しミスったときどうなるのかも謎。

# Baseはdb.pyで定義してる。
# from sqlalchemy.orm import declarative_base
# Base = declarative_base()
class TaskTable(Base):
    __tablename__ = 'task'

    id = Column(String(20), primary_key=True, nullable=False)
    contents = Column(String(100), nullable=False)
    priority = Column(Integer, nullable=False)
    progress = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)# pylint: disable=not-callable
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now(), nullable=False)# pylint: disable=not-callable


# POSTやPUTのとき受け取るRequest Bodyのモデルを定義
class Task(BaseModel):
    id: str
    contents: str
    priority: int
    progress:int


# main-------------------------------

app = FastAPI()

# CORSの設定を追加。全部ワイルドカード。
# 多分、本当は allow_origins=["http://localhost:3001"] みたく書く。
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# テーブルの作成（dockerが作ってなければ）
Base.metadata.create_all(ENGINE)

# サンプルデータの挿入###################
task1 = TaskTable(id='1', contents='Task 1', priority=1, progress=1)
task2 = TaskTable(id='2', contents='Task 2', priority=2, progress=2)

session.add(task1)#########
session.add(task2)########
session.commit()###########

# データのクエリtest###########
tmpTasks = session.query(TaskTable).all()
for x in tmpTasks:
    logger.debug(f"{x.id}, {x.contents}, {x.priority}, {x.progress}")


@app.get("/get_task_data/{date}")
def get_task_data(date: str):
    try:
        logging.info("Fetching tasks for date: %s", date)
        # id.like(文字列)で、その文字列を含むidを持つデータをフィルタリングする
        # all()で、フィルタリングされた全てのデータをリストとして取得する
        tasks = session.query(TaskTable).filter(TaskTable.id.like(f'%{date}%')).all()
        return tasks
    except Exception as e:
        logging.error("!!!Error fetching tasks: %s", e)
        raise HTTPException(status_code=500, detail="Failed to fetch tasks")from e

@app.post("/post_tomorrow_task")
def insert_task_data(request_data: List[Task]):
    logger.debug("post_tomorrow_task")##########
    tasks_to_insert = []
    for task_data in request_data:
        # 例えば、session.add(task) とかで、taskをDBに追加できる
        task = TaskTable(
            id=task_data.id,
            contents=task_data.contents,
            priority=task_data.priority,
            progress=task_data.progress,
        )
        tasks_to_insert.append(task)

    try:
        logger.debug("post_tomorrow_task/try")##########
        session.add_all(tasks_to_insert)
        session.commit()
        return {"message": "Tasks inserted successfully"}
    except Exception as e:
        logger.debug("post_tomorrow_task/except")##########
        session.rollback()
        logging.error(f"Error inserting tasks: {e}")
        raise HTTPException(status_code=500, detail="Failed to insert tasks") from e

@app.post("/post_deleted_task")
def delete_task_data(request_data: Task):
    try:
        # タスクが存在するかを確認
        task = session.query(TaskTable).filter(TaskTable.id == request_data.id).first()

        if not task:
            logging.warning(f"No task found with id: {request_data.id}")
            raise HTTPException(status_code=404, detail="Task not found")

        # タスクを削除
        session.delete(task)
        session.commit()
        logging.info(f"Task with id {request_data.id} deleted successfully")

        return {"message": "Task deleted successfully"}
    except Exception as e:
        session.rollback()
        logging.error(f"Error deleting task: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete task") from e
    finally:
        session.close()
    
@app.post("/post_achievment/{data}")
def post_achievment(request_data: Task):
    try:
        # タスクが存在するかを確認
        task = session.query(TaskTable).filter(TaskTable.id == request_data.id).first()

        if not task:
            logging.warning(f"No task found with id: {request_data.id}")
            raise HTTPException(status_code=404, detail="Task not found")

        task.progress = request_data.progress
        session.commit()
        return {"message": "Task updated successfully"}
    except Exception as e:
        session.rollback()
        logging.error(f"Error updating task: {e}")
        raise HTTPException(status_code=500, detail="Failed to update task") from e
