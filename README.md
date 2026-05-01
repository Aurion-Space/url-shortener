# URL Shortener

URL Shortener is a production-oriented link shortener with an API backend, a simple frontend, PostgreSQL storage, and analytics for created links.

## Demo

Live demo: https://short.aurarios.cloud

Use the live site to try the deployed short-link flow without running the project locally.

## Features

- Shorten long URLs.
- Redirect short codes to original URLs.
- Track click counts and basic analytics.
- Health check endpoint for deployment monitoring.
- PostgreSQL-backed persistence.

## Tech Stack

- React + Vite frontend
- Express backend
- PostgreSQL
- Docker Compose deployment

## Local Development

Install and run the backend:

```bash
cd backend
npm install
npm run dev
```

Install and run the frontend:

```bash
cd frontend
npm install
npm run dev
```

## Environment

Use `.env.example` files as templates. Set `DB_PASSWORD`, `DATABASE_URL`, and `API_BASE_URL` for your own deployment. Real `.env` files, database data, and generated assets are ignored.

