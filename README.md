## Overview

![CleanShot 2023-01-18 at 09 22 23@2x](https://user-images.githubusercontent.com/72408418/213170544-53e5584b-914b-4ba6-8b81-71cc2a97f0b3.png)

## Features

- Create **PDFs** from HTML templates
- Create **Images** from HTML
- Variables for **dynamic** content
- **API** for integration into other systems
- Custom **css** per template
- Add new fonts
- Support Jinja2

## Getting Started

### Installation

```yml
docker run -d -p 8000:8000 \
-e "DB_NAME=pdfactory" \
-e "DB_PORT=5432" \
-e "DB_USER=postgres" \
-e "DB_PASS=password" \
-e "DB_HOST=localhost" \
-e "ADMIN_EMAIL=admin@gmail.com" \
-e "ADMIN_PASSWORD=admin" \
-e "DOMAIN=https://pdfactory.com" \
--name pdfactory wildsonc/pdfactory
```

> User: admin@gmail.com Password: admin

### HTML to PDF

```curl
curl --location --request POST 'http://localhost:8000/api/pdf' \
--header 'Authorization: Bearer 44f976aafa9277af948f54ad43c37cc813e6facd' \
--header 'Content-Type: application/json' \
--data-raw '{
    "template_id": "2",
    "json": {
        "client": "John Due",
        "provider": "Company",
        "amount": "$ 1000,00",
        "period": "12 months"
    }
}'
```

#### Optional parameters

When any of these parameters are sent, the response will be in json.

- output_html: `boolean`
- output_base64: `boolean`
- upload: `boolean`

> To use the upload it is necessary to configure the storage

### HTML to Image

```curl
curl --location --request POST 'http://localhost:8000/api/image' \
--header 'Authorization: Bearer 44f976aafa9277af948f54ad43c37cc813e6facd' \
--header 'Content-Type: application/json' \
--data-raw '{
    "html": "<html>...</html>",
    "upload": true # optional
}'
```

#### Optional parameters

When any of these parameters are sent, the response will be in json.

- upload: `boolean`
  > To use the upload it is necessary to configure the storage

### Storage (Optional)

Additional environments

```
S3_ENDPOINT=
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_BUCKET=
```

#### Usage

```curl
curl --location --request POST 'http://localhost:8000/api/pdf' \
--header 'Authorization: Bearer 44f976aafa9277af948f54ad43c37cc813e6facd' \
--header 'Content-Type: application/json' \
--data-raw '{
    "template_id": "2",
    "upload": true,
    "json": {
        "client": "John Due",
        "provider": "Company",
        "amount": "$ 1000,00",
        "period": "12 months"
    }
}'
```
