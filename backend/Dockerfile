FROM python:3.13-slim

WORKDIR /app

# Install runtime C libraries for GeoDjango (GDAL, PROJ, GEOS)

RUN apt-get update && apt-get install -y --no-install-recommends \
    gettext \
    build-essential \
    libpq-dev \
    binutils \
    libpq5 \
    gdal-bin \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY code/scripts ./code/scripts
RUN chmod +x /app/code/scripts/*

EXPOSE 8000
