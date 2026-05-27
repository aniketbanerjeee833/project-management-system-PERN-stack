# PMS Backend (TypeScript)

Quick start:

1. Copy `.env.example` to `.env` and set `DATABASE_URL` to your Neon/Postgres connection string.

2. Install dependencies from the `backend` folder:

```bash
cd backend
npm install
```

3. Run migrations to create the tables in your Neon DB:

```bash
npm run migrate
```

4. Start development server:

```bash
npm run dev
```

Notes:
- The migration script runs the SQL in `migrations/init.sql`.
- Recommended VS Code extensions are in `.vscode/extensions.json`.
