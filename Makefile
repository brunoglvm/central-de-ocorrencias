.PHONY: dev frontend backend minio

dev: minio
	pnpm exec concurrently \
		--names "BACKEND,FRONTEND" \
		--prefix-colors "blue,green" \
		"make backend" \
		"make frontend"

frontend:
	cd frontend && pnpm dev

backend:
	cd backend && pnpm dev

minio:
	docker compose up -d minio
