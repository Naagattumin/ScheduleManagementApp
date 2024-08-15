# -*- coding: utf-8 -*-
# モデルの定義
from sqlalchemy import Column, Integer, String,TIMESTAMP,func
from pydantic import BaseModel
from db import Base
from db import ENGINE

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


def main():
    # テーブルが存在しなければ、テーブルを作成
    Base.metadata.create_all(bind=ENGINE)


if __name__ == "__main__":
    main()
