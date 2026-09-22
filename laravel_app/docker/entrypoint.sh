#!/bin/sh
set -eu
cd /app

echo "[entrypoint] Phansite boot (PHP $(php -r 'echo PHP_VERSION;'))"

# 1. APP_KEY (wajib; .env tidak ikut git)
if [ -z "${APP_KEY:-}" ] || [ "${APP_KEY:-}" = "base64:placeholder-replace-me" ]; then
  if grep -q "^APP_KEY=.\+" .env 2>/dev/null; then
    echo "[entrypoint] APP_KEY diambil dari .env"
  else
    echo "[entrypoint] generate APP_KEY baru"
    php artisan key:generate --force
  fi
fi

# 2. Direktori writable + file SQLite (persist via volume)
mkdir -p database storage/app/public/projects storage/app/public/certificates \
  storage/framework/cache/data storage/framework/sessions storage/framework/views \
  storage/logs bootstrap/cache
touch "${DB_DATABASE:-/app/database/database.sqlite}"
chown -R www-data:www-data storage database bootstrap/cache
chmod -R 775 storage bootstrap/cache

# 3. Perbaiki symlink public/storage (symlink absolut lama rusak di container)
rm -f public/storage
php artisan storage:link --force

# 4. SQLite WAL agar read concurrent tidak mudah locked (persist per-file)
if command -v sqlite3 >/dev/null 2>&1; then
  sqlite3 "${DB_DATABASE:-/app/database/database.sqlite}" "PRAGMA journal_mode=WAL;" || true
fi

# 5. Cek ekstensi kritis upload (GD -> WebP). Warning saja, ImageOptimizer fallback aman.
php -m | grep -qi '^gd$' && echo "[entrypoint] gd OK (WebP aktif)" || echo "[entrypoint] WARNING: gd hilang, upload fallback ke file asli"

# 6. Re-discover package prod (tanpa provider require-dev) + migrasi
php artisan package:discover --ansi
php artisan migrate --force

# 7. Cache optimize untuk worker mode
php artisan optimize

echo "[entrypoint] siap -> supervisord (frankenphp :80 + queue-worker)"
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
