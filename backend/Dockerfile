FROM python:3.13-slim

WORKDIR /app

# Install runtime C libraries for GeoDjango (GDAL, PROJ, GEOS)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    gdal-bin \
    binutils \
    libproj-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
COPY code/scripts ./code/scripts

RUN pip install --no-cache-dir -r requirements.txt

RUN ls .
# Set container executable entrypoint
RUN chmod +x /app/code/scripts/*

EXPOSE 8000
