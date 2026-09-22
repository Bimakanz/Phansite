# Build stage: PHP dependencies (Composer 2.8 latest, PHP 8.4 platform)
FROM composer:2.8 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --no-scripts \
    --optimize-autoloader \
    --ignore-platform-reqs
COPY . .
RUN composer dump-autoload --optimize --no-dev

# Build stage: frontend (Node 24 LTS latest, matches host v24.19.0)
FROM node:24-alpine AS frontend
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci --ignore-scripts --legacy-peer-deps
COPY resources ./resources
COPY vite.config.js tailwind.config.js postcss.config.js jsconfig.json ./
COPY public ./public
RUN npm run build

# Runtime stage: FrankenPHP 1.x + PHP 8.4 (multi-arch amd64/arm64, Caddy multithread)
FROM dunglas/frankenphp:1-php8.4-alpine AS runtime
WORKDIR /app

# System deps: supervisor (queue worker), curl (healthcheck), sqlite CLI (WAL pragma)
RUN apk add --no-cache supervisor curl sqlite && \
    install-php-extensions \
        gd \
        pdo_sqlite \
        sqlite3 \
        mbstring \
        xml \
        zip \
        bcmath \
        intl \
        opcache \
        exif \
        pcntl

# PHP production tuning: upload aman (validasi app 4MB) + OPcache/JIT multithread
COPY docker/php.ini $PHP_INI_DIR/conf.d/99-phansite.ini
COPY Caddyfile /etc/caddy/Caddyfile
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# App code + built artifacts
COPY . .
COPY --from=vendor /app/vendor ./vendor
COPY --from=frontend /app/public/build ./public/build

# Writable dirs for www-data (upload + sqlite + cache) — fixes 500 on upload
# Hapus cache bootstrap bawaan dev (berisi provider require-dev spt Pail) agar tidak kebawa ke prod
RUN mkdir -p database storage/app/public/projects storage/app/public/certificates \
        storage/framework/cache/data storage/framework/sessions storage/framework/views \
        storage/logs bootstrap/cache && \
    rm -f bootstrap/cache/*.php && \
    chown -R www-data:www-data storage database bootstrap/cache && \
    chmod -R 775 storage bootstrap/cache && \
    rm -f public/storage

ENV APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr \
    DB_CONNECTION=sqlite \
    DB_DATABASE=/app/database/database.sqlite \
    SESSION_DRIVER=database \
    CACHE_STORE=database \
    QUEUE_CONNECTION=database \
    FILESYSTEM_DISK=public \
    SERVER_NAME=:80

EXPOSE 80
VOLUME ["/app/database", "/app/storage/app/public"]
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD curl -fsS http://localhost:80/up || exit 1

ENTRYPOINT ["entrypoint.sh"]
