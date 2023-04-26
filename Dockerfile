FROM python:slim-bullseye

WORKDIR /code

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN apt-get -y update \
    && apt-get install -y \
    python3-pip python3-cffi python3-dev python3-brotli libpango-1.0-0 libpangoft2-1.0-0  \
    && apt-get -y clean

COPY requirements.txt /code/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /code

RUN python manage.py collectstatic --no-input
RUN rm -r /code/frontend

CMD ["sh", "-c", "python manage.py migrate && gunicorn core.wsgi:application --bind 0.0.0.0:8000 --access-logfile - --workers 8"]
