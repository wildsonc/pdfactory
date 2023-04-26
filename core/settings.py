import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY", "58da4f3c3980dc1d9a38c18a0ca7688472b54ad9a49d946621e8e3d212e58a74")

DEBUG = os.getenv("DEBUG", False) == "true"

ALLOWED_HOSTS = ["*"]
if os.getenv("DOMAIN_URL"):
    CSRF_TRUSTED_ORIGINS = [os.getenv("DOMAIN_URL")]

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.humanize",
    # libs
    "rest_framework",
    "rest_framework.authtoken",
    "dj_rest_auth",
    "corsheaders",
    "mathfilters",
    # apps
    "app",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME", "pdfactory"),
        "USER": os.getenv("DB_USER", "postgres"),
        "PASSWORD": os.getenv("DB_PASS"),
        "HOST": os.getenv("DB_HOST", "localhost"),
        "PORT": os.getenv("DB_PORT", "5432"),
    },
    # "default": {
    #     "ENGINE": "django.db.backends.sqlite3",
    #     "NAME": BASE_DIR / "db.sqlite3",
    # }
}


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = os.getenv("LOCALE", "en-us")

DATE_FORMAT = os.getenv("DATE_FORMAT")
SHORT_DATE_FORMAT = os.getenv("SHORT_DATE_FORMAT")
DATETIME_FORMAT = os.getenv("DATETIME_FORMAT")
SHORT_DATETIME_FORMAT = os.getenv("SHORT_DATETIME_FORMAT")
DECIMAL_SEPARATOR = os.getenv("DECIMAL_SEPARATOR")
THOUSAND_SEPARATOR = os.getenv("THOUSAND_SEPARATOR")


TIME_ZONE = os.getenv("TIMEZONE", "UTC")

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

# static
VITE_APP_DIR = os.path.join(BASE_DIR, "frontend")

STATIC_URL = "/static/"
STATICFILES_DIRS = [
    os.path.join(VITE_APP_DIR, "dist"),
]
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
# media
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

CORS_ALLOW_ALL_ORIGINS = True

REST_FRAMEWORK = {
    "DEFAULT_PARSER_CLASSES": ["rest_framework.parsers.JSONParser"],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "core.classes.BearerAuthentication",
        "dj_rest_auth.jwt_auth.JWTCookieAuthentication",
    ],
}
REST_USE_JWT = True
OLD_PASSWORD_FIELD_ENABLED = True
LOGOUT_ON_PASSWORD_CHANGE = False
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
}

# S3
DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"
AWS_S3_ACCESS_KEY_ID = os.getenv("S3_ACCESS_KEY")
AWS_S3_SECRET_ACCESS_KEY = os.getenv("S3_SECRET_KEY")
AWS_STORAGE_BUCKET_NAME = os.getenv("S3_BUCKET")
AWS_S3_ENDPOINT_URL = os.getenv("S3_ENDPOINT")
AWS_DEFAULT_ACL = None
AWS_QUERYSTRING_AUTH = os.getenv("S3_QUERYSTRING_AUTH", "false").lower() == "true"
AWS_S3_FILE_OVERWRITE = False
