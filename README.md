# Vanilla Dream

Vanilla Dream is a fashion career growth web game MVP bootstrap.

This step implements only the `step01_bootstrap` scope:
- Spring Boot backend skeleton
- Next.js + TypeScript frontend skeleton
- PostgreSQL connection configuration
- Common API error response shape
- Health check endpoint
- README and env examples

No gameplay business features are implemented yet beyond route/module placeholders and the health check.

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
- CORS + permissive bootstrap security configuration
- common success envelope
- common error response structure
- placeholder module packages for future MVP features

### Backend Environment

`backend/.env.example`

```env
SERVER_PORT=8080
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/vanilla_dream
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
SPRING_JPA_HIBERNATE_DDL_AUTO=update
APP_CORS_ALLOWED_ORIGIN=http://localhost:3000
```

Note:
- Spring Boot does not automatically read `.env` by itself in this setup.
- Set these values in your shell, IDE run configuration, or system environment before starting the backend.

## Frontend

Implemented:
- Next.js App Router skeleton
- landing page
- login and signup pages
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
- Gradle installed locally

PowerShell example:

```powershell
$env:SERVER_PORT="8080"
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/vanilla_dream"
$env:SPRING_DATASOURCE_USERNAME="postgres"
$env:SPRING_DATASOURCE_PASSWORD="postgres"
$env:APP_CORS_ALLOWED_ORIGIN="http://localhost:3000"
gradle bootRun
```

Health check:

```text
GET http://localhost:8080/api/health
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
1. Auth API and login/signup integration
2. Character creation
3. Job selection
4. Quest/class/level progression
5. Minigames
6. Shop/inventory/outfit
7. Promotion
8. Lightweight social

## Notes

- This workspace did not contain an existing runnable project, so the bootstrap was created from scratch.
- Backend build files are ready, but the local environment currently does not have Gradle installed, so backend execution was not fully verified inside this session.
- Frontend dependencies were not installed inside this session, so Next.js pages were scaffolded but not booted here.
- In some Windows environments, Docker Compose may fail to derive a project name from non-ASCII folder names, so the compose file now sets `name: vanilla-dream` explicitly.
