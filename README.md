# CampusConnect

CampusConnect is split into independent `backend` and `frontend` folders:

```text
CampusConnect/
├── backend/   # Flask API, Supabase schema, and backend environment
├── frontend/  # React/Vite application and frontend environment
├── venv/      # Existing local Python virtual environment
└── README.md
```

## Backend setup

1. Configure the Supabase database by running [`backend/schema.sql`](backend/schema.sql) in the Supabase SQL Editor.
2. In PowerShell, create `backend/.env` from `backend/.env.example` and set your Supabase URL and publishable key. Keep server-side keys in this backend file only.
3. Start the Flask API in a terminal:

   ```powershell
   cd backend
   ..\venv\Scripts\python.exe app.py
   ```

   The API runs at <http://localhost:5000>.

## Frontend setup

In a second terminal:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Open <http://localhost:3000>. Vite proxies `/api` requests to the Flask API at `http://localhost:5000`.

## Environment files

- `backend/.env` holds Supabase credentials and must never be exposed to the browser.
- `frontend/.env` holds browser-safe Vite settings. Set `VITE_BACKEND_URL` if the Flask API runs on a different URL.
- Both `.env` files are ignored by Git.

The API currently supports browsing events, event details, registrations, and attendee lists. The event creation, check-in, and cancellation helpers remain frontend-local. The API does not require authentication; review the access policies before using it with real student data.
