# main.py
from fastapi import FastAPI
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
    allow_credentials=True,   # 追記により追加
    allow_methods=["*"],      # 追記により追加
    allow_headers=["*"]       # 追記により追加
)


@app.get("/get_task_data/{date}")
def get_task_data(date: str):
    logging.info(date)
    task = session.query(TaskTable).filter(TaskTable.id.like(f'%{date}%')).all()
    return task

# @app.post("/insert_task_data/{today}")
# def insert_task_data(request_data: List[Task],):
#     logging.info(request_data)
#     search_string="20240811"
#     task = session.query(TaskTable).filter(TaskTable.id.like(f'%{search_string}%')).all()
#     logging.info(task)
#     return task
 
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)