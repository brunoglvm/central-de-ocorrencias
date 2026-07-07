#!/bin/sh
set -e

sleep 5

mc alias set local http://minio:9000 ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD}

mc mb local/admin || true

mc anonymous set public local/admin

mc stat local/admin/admin-avatar.webp || mc cp /setup/storage/admin-avatar.webp local/admin/