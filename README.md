# Vanilla Dream

Vanilla Dream is a fashion career growth web game MVP bootstrap.

Current implemented scope:
- Spring Boot backend skeleton
- Next.js + TypeScript frontend skeleton
- PostgreSQL connection configuration
- Common API error response shape
- Health check endpoint
- Signup/login/me authentication API
- JWT-based frontend login state and protected game route wrapper
- Character creation, current character lookup, appearance update, and one-time job selection
- Frontend character creation and job selection flow after login
- README and env examples

Gameplay systems beyond character setup and job selection are not implemented yet.

## Stack

- Backend: Spring Boot + Spring Web + Spring Data JPA + Spring Security + Validation
- Frontend: Next.js App Router + TypeScript
- Database: PostgreSQL
- Architecture: single server + REST API

## Folder Structure

```text
.
|-- backend
|   |-- build.gradle
|   |-- settings.gradle
|   |-- .env.example
|   `-- src/main
|       |-- java/com/vanilladream/backend
|       |   |-- config
|       |   |-- auth
|       |   |-- character
|       |   |-- quest
|       |   |-- minigame
|       |   |-- shop
|       |   |-- inventory
|       |   |-- promotion
|       |   |-- social
|       |   |-- common
|       |   `-- seed
|       `-- resources/application.yml
|-- frontend
|   |-- app
|   |-- components
|   |-- features
|   |-- hooks
|   |-- lib
|   |-- styles
|   |-- types
|   |-- package.json
|   `-- .env.example
`-- docker-compose.yml
```

## Backend

Implemented:
- Spring Boot application entry point
- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/characters`
- `GET /api/characters/me`
- `PATCH /api/characters/me/appearance`
- `POST /api/characters/me/job`
- CORS + stateless JWT security configuration
- common success envelope
- common error response structure
- Flyway migrations for the `accounts`, `characters`, and `character_stats` tables
- placeholder module packages for future MVP features

### Backend Environment

`backend/.env.example`

```env
SERVER_PORT=8080
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/vanilla_dream
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
APP_CORS_ALLOWED_ORIGIN=http://localhost:3000
APP_JWT_SECRET=change-this-local-secret-to-a-long-random-string-at-least-32-bytes
APP_JWT_EXPIRATION_MINUTES=120
```

Note:
- Spring Boot does not automatically read `.env` by itself in this setup.
- Set these values in your shell, IDE run configuration, or system environment before starting the backend.

## Frontend

Implemented:
- Next.js App Router skeleton
- landing page
- login and signup pages connected to the backend API
- localStorage JWT token storage
- protected route wrapper for authenticated game screens
- character creation page connected to the backend API
- job selection page connected to the backend API
- plaza entry flow that redirects to character creation or job selection when needed
- placeholder routes for core MVP screens
- lightweight API client
- backend health status card

### Frontend Environment

`frontend/.env.example`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

Copy it to `.env.local` before running the frontend.

## PostgreSQL Setup

The simplest local option is Docker Compose:

```bash
docker compose up -d
```

If Docker Compose fails to infer a project name from the current folder, use:

```bash
docker compose -p vanilla-dream up -d
```

This starts PostgreSQL at:
- host: `localhost`
- port: `5432`
- database: `vanilla_dream`
- user: `postgres`
- password: `postgres`

If you already run PostgreSQL locally, use the same values in `SPRING_DATASOURCE_*`.

## Run

### 1. Start PostgreSQL

```bash
docker compose up -d
```

Fallback:

```bash
docker compose -p vanilla-dream up -d
```

### 2. Run backend

Requirements:
- JDK 21+
- Use the included Gradle wrapper

PowerShell example:

```powershell
$env:SERVER_PORT="8080"
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/vanilla_dream"
$env:SPRING_DATASOURCE_USERNAME="postgres"
$env:SPRING_DATASOURCE_PASSWORD="postgres"
$env:APP_CORS_ALLOWED_ORIGIN="http://localhost:3000"
$env:APP_JWT_SECRET="change-this-local-secret-to-a-long-random-string-at-least-32-bytes"
$env:APP_JWT_EXPIRATION_MINUTES="120"
.\gradlew.bat bootRun
```

Health check:

```text
GET http://localhost:8080/api/health
```

Auth endpoints:

```text
POST http://localhost:8080/api/auth/signup
POST http://localhost:8080/api/auth/login
GET  http://localhost:8080/api/auth/me
```

Character endpoints:

```text
POST  http://localhost:8080/api/characters
GET   http://localhost:8080/api/characters/me
PATCH http://localhost:8080/api/characters/me/appearance
POST  http://localhost:8080/api/characters/me/job
```

### 3. Run frontend

```powershell
cd frontend
Copy-Item .env.example .env.local
npm.cmd install
npm.cmd run dev
```

Open:

```text
http://localhost:3000
```

## Next Steps

Follow the remaining project order from the spec:
1. Quest/class/level progression
2. Minigames
3. Shop/inventory/outfit
4. Promotion
5. Lightweight social

## Notes

- This workspace did not contain an existing runnable project, so the bootstrap was created from scratch.
- In some Windows environments, Docker Compose may fail to derive a project name from non-ASCII folder names, so the compose file now sets `name: vanilla-dream` explicitly.
