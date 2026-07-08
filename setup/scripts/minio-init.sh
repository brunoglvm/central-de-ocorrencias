#!/bin/sh
set -e

sleep 5

mc alias set local http://minio:9000 ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD}

mc mb local/admin || true
mc anonymous set public local/admin

mc mb local/occurrences || true
mc anonymous set public local/occurrences

# Imagens de exemplo (apenas para ambiente de desenvolvimento)
mc stat local/admin/admin-avatar.webp || mc cp /setup/storage/admin-avatar.webp local/admin/

for image in /setup/storage/occurrences/mock-occurrence-*.webp; do
  filename=$(basename "$image")

  mc stat "local/occurrences/$filename" || mc cp "$image" "local/occurrences/"
done