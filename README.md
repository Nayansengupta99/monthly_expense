# Monthly Expense Calculator

A full-stack web app to track and calculate monthly expenses. Save expense
items, look up how much you spent in a given month, and pull the total spend
for a whole year. Includes Google SSO login, per-user activity tracking, a live
online-user count, and AI-style item-image prediction from the item name.

- **Backend:** Spring Boot 3 (Java 17) + MongoDB Atlas
- **Frontend:** React (Create React App)
- **Auth:** Google Identity Services (OAuth 2.0), no Spring Security

---

## Features

- **Save expenses** — item name, price, and timestamp via a simple form.
- **Monthly total** — see how much was spent in a particular month.
- **Yearly total** — pull the total expense for a full year.
- **Item image prediction** — predicts a relevant image from the item name
  (28 categories with typo tolerance) and shows it beside each item.
- **Paginated list drawer** — browse saved items in a separate panel with
  pagination.
- **Google SSO login** — register/sign in with a Google account.
- **User activity tracking** — login, logout, idle, and auto-logout events are
  saved to MongoDB.
- **30-minute idle auto-logout** — sessions expire after 30 minutes idle.
- **Live user count** — real-time count of users currently online.
- **Animated, mobile-friendly UI** — lively gradient background and responsive
  layout.

---

## Project structure

```
monthly_expense/
├── src/main/java/com/expense/app/   # Spring Boot backend
│   ├── controller/                  # REST endpoints (expense + auth)
│   ├── service/                     # Business logic, Google token verify, scheduler
│   ├── model/                       # Mongo documents & DTOs
│   ├── repository/                  # Spring Data Mongo repos
│   └── config/CorsConfig.java       # CORS configuration
├── monthly_exp_ui/                  # React frontend
│   ├── src/App.js                   # Main UI, predictor, auth/idle logic
│   ├── src/Login.js                 # Google login page
│   └── src/config.js                # API base URL + timeout constants
├── Dockerfile                       # Backend container (Temurin 17)
├── render.yaml                      # Render deployment blueprint
└── pom.xml
```

---

## Prerequisites

- **Java 17** (required — Java 21 breaks Lombok 1.18.26 during build)
- **Maven** (the bundled `./mvnw` wrapper works)
- **Node.js 16+** and npm
- **MongoDB** — a MongoDB Atlas cluster (or a local MongoDB instance)
- **Google OAuth 2.0 Web Client ID** — from the Google Cloud Console

---

## Configuration

### Backend (environment variables)

All have sensible fallbacks for local dev, but override these in production:

| Variable               | Description                                   | Default        |
|------------------------|-----------------------------------------------|----------------|
| `PORT`                 | HTTP port the server listens on               | `8081`         |
| `MONGODB_URI`          | Full MongoDB connection string                | Atlas fallback |
| `MONGODB_PASSWORD`     | Password injected into the default Atlas URI  | (committed)    |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID for token verification | (none)         |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins               | `*`            |

### Frontend (`monthly_exp_ui/.env`)

| Variable                     | Description                                        |
|------------------------------|----------------------------------------------------|
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth Web Client ID                          |
| `REACT_APP_API_BASE_URL`     | Backend base URL (leave empty locally to use proxy) |

See `monthly_exp_ui/.env.example` for a template.

---

## Running locally

### 1. Start the backend

```bash
# Use Java 17
export JAVA_HOME=/path/to/java-17

./mvnw spring-boot:run
```

The API starts on `http://localhost:8081`.

### 2. Start the frontend

```bash
cd monthly_exp_ui
npm install
npm start
```

The UI opens at `http://localhost:3000` and proxies API calls to the backend
(via the `proxy` field in `package.json`).

> **Google login origins:** Add `http://localhost:3000` to your OAuth client's
> Authorized JavaScript origins in the Google Cloud Console.

---

## API endpoints

### Expenses
- `POST /expense/save` — save an expense item.
- `GET  /expense?year=YYYY` — items/total for a year.
- `GET  /expense/month?month=MM-YYYY` — items/total for a month.

### Auth
- `POST /auth/google` — exchange a Google ID token for a session.
- `POST /auth/heartbeat` — keep-alive / idle reporting.
- `POST /auth/logout` — end a session.
- `GET  /auth/live-users` — current live user count.

---

## Deployment (Vercel + Render)

The frontend deploys to **Vercel** and the backend to **Render**.

1. **Push** the repo to GitHub.
2. **MongoDB Atlas** → Network Access → allow `0.0.0.0/0`; rotate the DB
   password.
3. **Render** → New → Blueprint (uses `render.yaml`) or a Docker Web Service.
   Set env vars: `MONGODB_URI`, `GOOGLE_CLIENT_ID`,
   `CORS_ALLOWED_ORIGINS=<your Vercel URL>`.
4. **Vercel** → import the repo, set **Root Directory = `monthly_exp_ui`**.
   Set env vars: `REACT_APP_API_BASE_URL=<your Render URL>`,
   `REACT_APP_GOOGLE_CLIENT_ID`.
5. **Google Cloud Console** → add your Vercel URL to Authorized JavaScript
   origins.

---

## Building for production

```bash
# Backend jar
export JAVA_HOME=/path/to/java-17
./mvnw clean package -DskipTests

# Frontend static build
cd monthly_exp_ui
CI=false npm run build
```

---

## Security notes

- **Rotate the committed MongoDB password** before making the app public — it
  currently exists in the git history. Use the `MONGODB_URI` env var in
  production instead of the hardcoded fallback.
- Never commit real OAuth client secrets or database credentials.

---

## Tech stack

| Layer     | Technology                                  |
|-----------|---------------------------------------------|
| Backend   | Spring Boot 3, Spring Data MongoDB, Lombok  |
| Frontend  | React (CRA)                                 |
| Database  | MongoDB Atlas                               |
| Auth      | Google Identity Services (OAuth 2.0)        |
| Deploy    | Docker, Render (API), Vercel (UI)           |
