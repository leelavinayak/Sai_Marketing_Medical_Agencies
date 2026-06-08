# Sai Marketing and Medical Agencies

A production-ready React + Express application for a medical sales and distribution business.

## Local development

### Prerequisites
- Node.js 20+
- npm

### Setup
1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env`:
   `cp .env.example .env`
3. Update `.env` with your local configuration values.
4. Start the application:
   `npm run dev`

### Available scripts
- `npm run dev` — start the app in development mode with Vite and Express middleware.
- `npm run build` — build the frontend and bundle the server for production.
- `npm run start` — start the compiled production server.
- `npm run lint` — check TypeScript types.
- `npm run clean` — remove generated build output and local seed data.

## Production deployment

This project is configured for deployment on Render with a Node web service.

### Render settings
- Build command: `npm run build`
- Start command: `npm run start`
- Environment: `node`
- Branch: `main`

### Required environment variables
Set these on Render or your production host:
- `JWT_SECRET`
- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `GEMINI_API_KEY` (if using Gemini integration)
- `APP_URL` (optional, for self-referential links)

> Do not commit `.env` to source control. Use `.env.example` for local configuration only.

## Render deployment helper
A `render.yaml` file is included in the repository to simplify Render service setup.
