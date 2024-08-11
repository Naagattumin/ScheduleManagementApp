# main.py
from fastapi import FastAPI
from db import session  
from model import TaskTable, Task
# from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.cors import CORSMiddleware
import logging
 
app = FastAPI()

# CORSの設定を追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,   # 追記により追加
    allow_methods=["*"],      # 追記により追加
    allow_headers=["*"]       # 追記により追加
)


@app.get("/get-today-task")
def get_today_task():
    logging.info("通った今日")
    return {"Hello": "World"}

@app.get("/get-tomorrow-task")
def get_tomorrow_task():
    logging.info("通った明日")
    return {"Hello": "World"}
 
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)