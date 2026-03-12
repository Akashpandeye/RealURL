# RealURL

Production-grade URL shortener with:

- **Backend**: Node serverless API (Vercel) + Neon Postgres + Drizzle
- **Frontend**: Next.js App Router + Clerk auth (no JWT)

## Structure

```
RealURL/
  backend/
  frontend/
```

## Local development

### Backend

1. Create `backend/.env`:

```
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_...
FRONTEND_URL=http://localhost:3000
```

2. Install + run:

```bash
cd backend
npm install
npm run dev
```

3. Push schema (first time):

```bash
cd backend
npm run db:push
```

### Frontend

1. Create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
BACKEND_DEV_URL=http://localhost:3001
```

2. Install + run:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel (two projects)

- Deploy `backend/` as one Vercel project
  - Env: `DATABASE_URL`, `CLERK_SECRET_KEY`, `FRONTEND_URL`
- Deploy `frontend/` as one Vercel project
  - Env: `NEXT_PUBLIC_API_URL` (backend URL)

