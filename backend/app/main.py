from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session  # Import Session from sqlalchemy.orm
from db import session
from model import TaskTable, Task
from starlette.middleware.cors import CORSMiddleware
import logging
from typing import List

app = FastAPI()

# CORSの設定を追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# データベースセッションを取得するための依存関係
def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

@app.get("/get_task_data/{date}")
def get_task_data(date: str):
    try:
        logging.info(f"Fetching tasks for date: {date}")
        tasks = session.query(TaskTable).filter(TaskTable.id.like(f'%{date}%')).all()
        return tasks
    except Exception as e:
        logging.error(f"Error fetching tasks: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch tasks")

@app.post("/post_tomorrow_task")
def insert_task_data(request_data: List[Task]):
    tasks_to_insert = []
    for task_data in request_data:
        task = TaskTable(
            id=task_data.id,
            contents=task_data.contents,
            priority=task_data.priority,
            progress=task_data.progress,
        )
        tasks_to_insert.append(task)
    
    try:
        session.add_all(tasks_to_insert)
        session.commit()
        return {"message": "Tasks inserted successfully"}
    except Exception as e:
        session.rollback()
        logging.error(f"Error inserting tasks: {e}")
        raise HTTPException(status_code=500, detail="Failed to insert tasks")

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
        raise HTTPException(status_code=500, detail="Failed to delete task")
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
        raise HTTPException(status_code=500, detail="Failed to update task")