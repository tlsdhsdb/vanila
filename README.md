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
- Quest list, quest progress overview, quest reward claim flow
- Job class list, class taking flow, EXP gain, level-up handling, and job stat growth
- Frontend character creation, job selection, plaza, quest journal, and academy flow after login
- README and env examples

Gameplay systems beyond quest/class progression are not implemented yet.

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
|       |   |-- jobclass
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
- `GET /api/quests`
- `GET /api/quests/active`
- `POST /api/quests/{questId}/claim`
- `GET /api/quests/progress`
- `GET /api/classes`
- `POST /api/classes/{classId}/take`
- CORS + stateless JWT security configuration
- common success envelope
- common error response structure
- Flyway migrations for the `accounts`, `characters`, `character_stats`, `quests`, `character_quests`, `job_classes`, and `job_class_stat_rewards` tables
- seed data for step04 quests and per-job academy classes
- server-side EXP/level progression with MVP level cap 10
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
- quest journal page connected to quest list, progress, and reward claim APIs
- academy page connected to class list and class taking APIs
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

Quest endpoints:

```text
GET  http://localhost:8080/api/quests
GET  http://localhost:8080/api/quests/active
POST http://localhost:8080/api/quests/{questId}/claim
GET  http://localhost:8080/api/quests/progress
```

Academy endpoints:

```text
GET  http://localhost:8080/api/classes
POST http://localhost:8080/api/classes/{classId}/take
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

Recommended flow:

```text
signup -> create character -> choose job -> plaza -> quests / academy
```

## Next Steps

Follow the remaining project order from the spec:
1. Minigames
2. Shop/inventory/outfit
3. Promotion
4. Lightweight social

## Step04 Notes

- The quest seed includes future-step quest entries for minigames and shopping so the progression order is visible early.
- Only step04 quest actions are fully playable right now: auto-completing early onboarding quests, claiming rewards, and taking academy classes.
- Promotion, shopping, and minigame quest targets are not implemented yet.

## Notes

- This workspace did not contain an existing runnable project, so the bootstrap was created from scratch.
- In some Windows environments, Docker Compose may fail to derive a project name from non-ASCII folder names, so the compose file now sets `name: vanilla-dream` explicitly.
