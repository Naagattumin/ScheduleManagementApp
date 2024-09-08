# pylint: disable=logging-fstring-interpolation
# pylint: disable=C0413
# pylint: disable=C0412

import logging
mylog = logging.getLogger("mylog")
mylog.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("🐕️%(asctime)s [🐾%(levelname)s🐾] %(pathname)s %(lineno)d %(funcName)s\n🐋%(message)s🐈️", datefmt="%y%m%d_%H%M%S"))
mylog.addHandler(handler)

import time, datetime
mylog.debug(f"backendの時刻確認1: {datetime.datetime.now()}")


# ===== db ====================

# ---- 接続情報`DATABASE`の作成 ---------
# 接続したいDBの基本情報を設定する

# これらを使って DATABASE が書かれる
# MySQLのコンソールで打つ mysql> USE database_name; とかはこれら
user_name = "user"
password = "password"
host = "db"  # docker-composeで定義したMySQLのサービス名
database_name = "sample_db"

# 上で設定したものを使って、DATABASEを作成する
# mysql://<ユーザー名>:<パスワード>@<ホスト>/<データベース名>?charset=utf8
# sqliteなら　'sqlite:///sample.db'（相対パス）とか書くらしい
DATABASE = f"mysql://{user_name}:{password}@{host}/{database_name}?charset=utf8mb4"

# 読みにくいから変更
# f""みたいな構文。DBの接続情報を設定の文字列を作る。
# DATABASE = 'mysql://%s:%s@%s/%s?charset=utf8mb4' % (
#     user_name,
#     password,
#     host,
#     database_name,)



# ---- DBとの接続に使う`ENGINE`の作成 --------
# ENGINEはデータベースとの接続を管理し、SQLAlchemy ORMがデータベース操作を行うための基盤となります。
# create_engine()関数を使用して、データベースとの接続を管理するEngineオブジェクトを作成します。
# echo=True にすると、SQLAlchemyが生成するSQL文を標準出力に出力するようになります。

from sqlalchemy import create_engine

# 普通はこれでいけるはず
ENGINE = create_engine(
    DATABASE,
    # encoding="utf-8",
    echo=True
)

# # yaml に healthcheck: だとか db: condition: service_healthy だとかを書いたら直った。
# # 多分、dockerのコンテナ back_db が立ち上がる前にアクセスしようとして失敗してた。それをリトライするように変更した。
# # .connect()が成功しなかったら、5秒待ってリトライする。5回リトライしてもダメだったらエラーを出す。
# from sqlalchemy.exc import OperationalError

# def create_engine_with_retry(retries=5, delay=5):
#     for _ in range(retries):
#         try:
#             engine = create_engine(DATABASE, echo=True)
#             tmpTestConnection = engine.connect()# pylint: disable=C0103, disable=W0612
#             return engine
#         except OperationalError:
#             mylog.warning(f"Connection failed, retrying in {delay} seconds...")
#             time.sleep(delay)
#     mylog.error("Failed to connect to the database after several attempts")
#     raise OperationalError("!!!Failed to connect to the database after several attempts", params=None, orig=None)

# ENGINE = create_engine_with_retry()



# ---- データ操作オブジェクト`session`の作成 ---------
# sessionは、SQLAlchemyを使用してデータベースとの対話を管理するためのオブジェクトです。具体的には、データベースへのクエリの実行、トランザクションの管理、データの追加・更新・削除などの操作を行います。
# sessionmaker()関数を使用して、セッションを作成するためのSessionクラスを作成します。

from sqlalchemy.orm import sessionmaker, scoped_session

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



# ===== model ====================

# ---- テーブルを定義 ---------------
# ScheduleManagementApp\mysql\initdb.d\schema.sql でも定義してるけど、mysqlを使うときはここでも定義する必要がある。両方必要で、矛盾があるとエラーになる。

from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, String, Integer, TIMESTAMP, func

# Baseは、SQLAlchemyのdeclarative_base関数を使用して作成される基本クラスです。このクラスを継承することで、データベーステーブルとマッピングされるモデルクラスを定義することができます。
Base = declarative_base()

# session.query(TaskTable).filter みたいな書き方だけでなく TaskTable.query.filter みたいなのも使えるようになる
Base.query = session.query_property()

# TaskTableは、Baseを継承して定義されたモデルクラスです。このクラスは、データベースのtaskテーブルとマッピングされ、各カラムを属性として持ちます。
class TaskTable(Base):
    """session.add(task) とかでDBに追加するとき、このクラスを引数にする。後で Base.metadata.create_all(ENGINE) でテーブルを作成する。

    Args:
        Base (？): Base = declarative_base() で作ったやつ

    Returns:
        task1 = TaskTable(id='1', exec_date = "2024-01-01", contents='Task 1', priority=1, progress=1) や session.add(task) みたいな感じで使う
    """
    __tablename__ = 'task'

    id = Column(String(20), primary_key=True, nullable=False)
    exec_date = Column(String(20), nullable=False)
    contents = Column(String(100), nullable=False)
    priority = Column(Integer, nullable=False)
    progress = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)# pylint: disable=not-callable
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now(), nullable=False)# pylint: disable=not-callable



# ===== main ====================

# ---- テーブルの作成--------------
# dockerが作ってなければ
# Base.metadata.create_all(ENGINE)



from fastapi import FastAPI, HTTPException

app = FastAPI()



from starlette.middleware.cors import CORSMiddleware

# CORSの設定を追加（多分、fastapiの機能）。今回は全部ワイルドカード。
# 例えば、https://www.google.com/~~~ の中で実行されたスクリプトは https://www.google.com/~~~ にしかアクセスできません。
# 他のサイト（例： https://api.example.com ）にアクセスするには、そのアクセス先のサイト（ https://api.example.com ）がCORSを許可している必要があります。
# ここでは、すべてのオリジンからのリクエストを許可する設定をしていますが、本番環境では特定のオリジンのみを許可することが推奨されます。
# 本当は、例えば allow_origins=["http://localhost:3001", "https://www.google.com"] のように書くべきです。
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)



# サンプルデータの挿入###################
task1 = TaskTable(id='1', exec_date = "2024-01-01", contents='Task 1', priority=1, progress=1)
task2 = TaskTable(id='2', exec_date = "2024-01-01", contents='Task 2', priority=2, progress=2)

session.add(task1)#########
session.add(task2)########
session.commit()###########

# データのクエリtest###########
tmpTasks = session.query(TaskTable).all()
for x in tmpTasks:
    mylog.debug(f"{x.id}, {x.contents}, {x.priority}, {x.progress}")



# pydantic は型を厳密にするやつらしい。通信のときに型が厳密じゃないとセキュリティインシデントだかになるらしい。
from pydantic import BaseModel
class Task(BaseModel):
    """POSTやPUTのとき受け取る Request Body のモデルを定義。@app.post("/~~~)↓ def post_tasks(tasks: List[Task]): みたいな感じで使う。

    Args:
        BaseModel (？): from pydantic import BaseModel でインポートしたやつ
    """
    id: int
    exec_date: str
    contents: str
    priority: int
    progress:int



def py_epoch_to_datetime(py_epoch, tomorrow=0):
    """午前4時に日付が変わるようにずれた日時を返す。返り値は日付のみを使うこと。

    Args:
        py_epoch (int, str): エポック秒。
        tomorrow (int, optional): tomorrow=1 なら翌日の日付を返す. Defaults to 0.

    return:
        datetime.datetime: 日付のみを使うこと
    """
    assert tomorrow in (0, 1)
    py_epoch = int(py_epoch)
    # 4 * 60 * 60 は4時間の秒数。午前4時に日付が変わるようにずらす。
    py_epoch = py_epoch - 4 * 60 * 60 + tomorrow * 24 * 60 * 60
    try:
        return datetime.datetime.fromtimestamp(py_epoch)
    except (ValueError, OSError) as e:
        raise ValueError(f"Invalid py_epoch format: {py_epoch}") from e



def js_epoch_to_datetime(js_epoch, tomorrow=0):
    """午前4時に日付が変わるようにずれた日時を返す。返り値は日付のみを使うこと。

    Args:
        js_epoch (int, str): エポックミリ秒。
        tomorrow (int, optional): tomorrow=1 なら翌日の日付を返す. Defaults to 0.

    return:
        datetime.datetime: 日付のみを使うこと
    """
    assert tomorrow in (0, 1)
    py_epoch = int(js_epoch) / 1000
    # 4 * 60 * 60 は4時間の秒数。午前4時に日付が変わるようにずらす。
    py_epoch = py_epoch - 4 * 60 * 60 + tomorrow * 24 * 60 * 60
    try:
        return datetime.datetime.fromtimestamp(py_epoch)
    except (ValueError, OSError) as e:
        raise ValueError(f"Invalid py_epoch format: {py_epoch}") from e



@app.get("/hello")
def hello():
    mylog.debug("hello")
    return {"message": "Hellow Wordld"}


@app.get("/get_task_data/{js_epoch}")
def get_task_data(js_epoch: str):
    mylog.debug("start: get_task_data")
    try:
        # id.like(文字列)で、その文字列を含むidを持つデータをフィルタリングする
        # all()で、フィルタリングされた全てのデータをリストとして取得する
        date = js_epoch_to_datetime(js_epoch).strftime("%Y%m%d")
        tasks = session.query(TaskTable).filter(TaskTable.exec_date.like(f'%{date}%')).all()
        mylog.info(f"Fetching tasks for date: {date}")
        for task in tasks:########
            print(task.__dict__)
        return tasks
    except Exception as e:
        mylog.error("Error fetching tasks: %s", e)
        raise HTTPException(status_code=500, detail="Failed to fetch tasks")from e

from typing import List

@app.post("/post_tomorrow_task")
def insert_task_data(tasks: List[Task]):
    mylog.debug("🐾🐾")

    tmp_exec_date = py_epoch_to_datetime(time.time(), 0).strftime("%Y%m%d")# デバグのためtommorow=0にしてる########

    # 同じ exec_date かつ同じ contents のタスクは追加しない
    same_date_tasks = session.query(TaskTable).filter(TaskTable.exec_date == tmp_exec_date).all()

    for same_date_task in same_date_tasks:##########
        mylog.debug(f"same_date_task: {same_date_task.contents}")

    # 同じタスクが有ったときメッセージに出すためのフラグ
    flag = 0
    tasks_to_insert = []
    for task in tasks:

        is_task_exists = 0
        for same_date_task in same_date_tasks:
            if same_date_task.contents == task.contents:
                mylog.debug(f"already exists in tomorrow_task: {task.contents}")
                flag = 1
                is_task_exists = 1
                break

        if is_task_exists == 0:
            task_to_insert = TaskTable(
                id = task.id,
                exec_date = tmp_exec_date,
                contents=task.contents,
                priority=task.priority,
                progress=task.progress,
            )
            tasks_to_insert.append(task_to_insert)
            mylog.debug(f"append to tasks_to_insert: {task_to_insert.contents}, exec_date: {task_to_insert.exec_date}")

    try:
        mylog.debug("post_tomorrow_task/try")
        session.add_all(tasks_to_insert)
        session.commit()
        if flag == 0:
            return {"message": "Tasks inserted successfully"}
        else:
            return {"message": "Some tasks already exists, others inserted successfully"}
    except Exception as e:
        mylog.debug("post_tomorrow_task/except")
        session.rollback()
        mylog.error(f"Error inserting tasks: {e}")
        raise HTTPException(status_code=500, detail="Failed to insert tasks") from e


@app.post("/post_deleted_task")
def delete_task_data(request_data: Task):
    try:
        # タスクが存在するかを確認
        task = session.query(TaskTable).filter(TaskTable.id == request_data.id).first()

        if not task:
            mylog.warning(f"No task found with id: {request_data.id}")
            raise HTTPException(status_code=404, detail="Task not found")

        # タスクを削除
        session.delete(task)
        session.commit()
        mylog.info(f"Task with id {request_data.id} deleted successfully")

        return {"message": "Task deleted successfully"}
    except Exception as e:
        session.rollback()
        mylog.error(f"Error deleting task: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete task") from e
    finally: # 要る？
        session.close()


@app.post("/post_achievment/{data}")
def post_achievment(request_data: Task):
    try:
        # タスクが存在するかを確認
        task = session.query(TaskTable).filter(TaskTable.id == request_data.id).first()

        if not task:
            mylog.warning(f"No task found with id: {request_data.id}")
            raise HTTPException(status_code=404, detail="Task not found")

        task.progress = request_data.progress
        session.commit()
        return {"message": "Task updated successfully"}
    except Exception as e:
        session.rollback()
        mylog.error(f"Error updating task: {e}")
        raise HTTPException(status_code=500, detail="Failed to update task") from e
