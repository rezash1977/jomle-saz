FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# ایجاد پوشه کش برای مدل‌ها تا هر بار دانلود نشن
env TRANSFORMERS_CACHE=/code/.cache
run mkdir -p /code/.cache && chmod 777 /code/.cache

COPY . .

CMD ["python", "app.py"]