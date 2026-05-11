# Team Task Manager

Full-stack task and project manager with admin and member roles. Admins create projects, assign members, and delegate tasks; members see their work on a dedicated dashboard.

## Stack

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Frontend | React 18, Vite 6, React Router 6, Axios, Recharts |
| Backend  | Flask 2.x, Flask-JWT-Extended, Flask-SQLAlchemy   |
| Database | SQLite (default; URI configurable)              |

## Repository layout

```
task manager/
├── backend/          # Flask API
│   ├── app/          # Application package (models, routes, extensions)
│   ├── wsgi.py       # App entry (also runs dev server on port 5000)
│   ├── seed.py       # Optional: create first admin user
│   ├── requirements.txt
│   └── .env.example
└── frontend/         # Vite + React SPA
    ├── src/
    └── package.json
```

## Prerequisites

- **Node.js** 18+ (tested with Node 22)
- **Python** 3.10+

## Backend setup

1. Open a terminal in the `backend` folder.

2. Create and activate a virtual environment. **Leave it activated** for steps 3–7.

   **Windows (PowerShell)**

   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

   **macOS / Linux**

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:

   **Windows (PowerShell or CMD)**

   ```powershell
   copy .env.example .env
   ```

   **macOS / Linux**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set a strong **`JWT_SECRET_KEY`**. The default **`DATABASE_URL`** is `sqlite:///tasks.db` (with cwd = `backend/`, SQLite usually creates `tasks.db` in that folder).

5. Create database tables:

   ```bash
   python -m flask --app wsgi:application init-db
   ```

6. (Optional) Seed a default **admin** account:

   ```bash
   python seed.py
   ```

   Defaults (override with environment variables if you prefer):

   - `SEED_ADMIN_EMAIL` — default `admin12@gmail.com`
   - `SEED_ADMIN_PASSWORD` — default `Admin123@`
   - `SEED_ADMIN_NAME` — default `Admin`

7. Start the API (listens on **http://127.0.0.1:5000**):

   ```bash
   python wsgi.py
   ```

## Frontend setup

1. In a new terminal, go to the `frontend` folder.

2. Install dependencies and run the dev server:

   ```bash
   npm install
   npm run dev
   ```

   The app is served at **http://localhost:5173**. Vite proxies requests under **`/api`** to the Flask backend at `http://127.0.0.1:5000`, so keep the backend running while you develop.

## Production build (frontend)

```bash
cd frontend
npm run build
npm run preview
```

Serve the contents of `frontend/dist/` with any static host or reverse proxy, and point API calls to your deployed backend (you may need to adjust the Vite proxy or use environment-based API URLs for production).

## API overview

Routes are mounted under **`/api`**:

- **`/api/auth`** — register (`POST /register`), login (`POST /login`), current user (`GET /me`, JWT required)
- **`/api`** — projects and related operations (see `backend/app/routes/projects.py`)
- **`/api`** — tasks (see `backend/app/routes/tasks.py`)
- **`/api`** — dashboard aggregates (see `backend/app/routes/dashboard.py`)

## App routes (frontend)

| Path | Notes |
| ---- | ----- |
| `/` | Landing / home |
| `/login`, `/register` | Authentication |
| `/app` | Redirects logged-in users to the correct dashboard |
| `/admin/dashboard`, `/admin/project/...` | Admin only |
| `/member/dashboard` | Member only |

