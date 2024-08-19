# FastAPI用Dockerfile
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

COPY ./app /app

# MySQLクライアントをインストール
RUN apt-get update && apt-get install -y default-mysql-client \
    && pip install -r /app/requirements.txt

# RUN pip install -r /app/requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
