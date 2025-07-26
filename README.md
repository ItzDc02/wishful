# Wishful

A tiny full‑stack prototype where people post wishes and anonymous donors can fulfill them. Frontend is React + TypeScript + Vite, styled with Tailwind. Backend is a minimal Express server that persists to a local `db.json`, handles image uploads via Cloudinary, and kicks off Razorpay test payments.

This README walks you through setup, environment variables, development workflow, API shape, and a few production notes (Vercel, serverless caveats, etc.).

---

## Quick start

```bash
# from repo root
npm install         # or pnpm install / yarn

# start backend
cd server && npm run dev
# default: http://localhost:4000

# start frontend in another terminal
cd client && npm run dev
# default: http://localhost:5173
```

Open `http://localhost:5173`, create a wish, refresh, and confirm it appears in `server/db.json`.

---

## Features

* Post a wish with title, description, optional image (Cloudinary upload)
* Browse individual wishes and fulfill them through a Razorpay test order flow
* Live preview while composing a wish
* Minimal state management, simple Axios wrapper for API calls
* JSON file persistence for local/dev simplicity

---

## Tech stack

**Frontend**
* React + TypeScript + Vite
* TailwindCSS (via `@tailwindcss/vite` plugin)
* Axios for HTTP

**Backend**
* Node.js + Express
* `fs` for a quick JSON “database”
* Razorpay server SDK (test keys)
* Cloudinary (unsigned uploads from client)

---

## Monorepo layout

```
.
├── client/                 # Vite + React app
│   ├── src/
│   │   ├── api/            # Axios instance
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── vite.config.ts
├── server/
│   ├── src/
│   │   └── index.js        # Express app & routes
│   └── db.json             # Local persistence
├── .gitignore
├── README.md               # This file
└── package.json (optional workspace root)
```

---

## Environment variables

**Client (exposed at build time)**

| Name | Description |
| --- | --- |
| `VITE_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `VITE_CLOUDINARY_UNSIGNED_PRESET` | Unsigned preset that allows direct browser uploads |
| `VITE_API_URL` (optional) | Override base API URL in prod (leave empty to hit same origin `/api`) |

**Server (keep these secret)**

| Name | Description |
| --- | --- |
| `PORT` | Defaults to 4000 |
| `RAZORPAY_KEY_ID` | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key |

Create `.env` files in `client/` and `server/` respectively (never commit secrets). See `.env.example` if provided.

---

## Development workflow

1. Run backend first so the Vite proxy can forward `/api` calls during dev.
2. Frontend hot reload lives at `localhost:5173`.
3. When you post a wish, check `server/db.json` to verify persistence.
4. Fulfillment flow: button → create Razorpay order on server → open Razorpay checkout → on success, POST `/api/wishes/:id/fulfill`.

If you see a 404 like `/api/wishes/undefined/fulfill`, confirm the component receives the correct `wishId` prop.

---

## API overview

Base path: `/api`

### `POST /api/wishes`
Create a new wish.
```json
{
  "title": "string",
  "description": "string",
  "imageUrl": "string | null"
}
```
Response: the saved wish object.

### `GET /api/wishes`
Return all wishes.

### `GET /api/wishes/:id`
Return a single wish.

### `POST /api/wishes/:id/fulfill`
Mark a wish fulfilled. Payload depends on your Razorpay flow (order/payment IDs, etc.).

> Note: The current repo broadcasts events with `broadcast("wish:new", wish)`; if you move to serverless, swap this for a pub/sub service or simple polling.

---

## Data model (Wish)

```ts
interface Wish {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  status: "pending" | "fulfilled";
  fulfilled: boolean;
  fulfilledBy: string | null;
  createdAt: number; // ms epoch
}
```

---

## Production & deployment notes

### Fast path (keep it simple)
Deploy the frontend to Vercel (static) and host the Node server elsewhere (Railway, Render, Fly, a VPS). Point `VITE_API_URL` to that backend.

### All-in Vercel (serverless)
* Switch from `fs` JSON to a real database (Vercel Postgres, Neon, Supabase, PlanetScale, Upstash Redis, etc.)
* Convert Express routes into serverless function files in `/api`
* Drop WebSockets and use polling or a hosted real-time service (Pusher, Ably)

See the “Do I need to change anything for Vercel?” answer in previous discussions for a full checklist.

---

## Scripts

Common ones you’ll see:

**client/package.json**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**server/package.json**
```json
{
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js"
  }
}
```

You can add a root `package.json` with workspaces and a `concurrently` script if you prefer:

```json
{
  "scripts": {
    "dev": "concurrently \"npm:dev --workspace=server\" \"npm:dev --workspace=client\""
  }
}
```

---

## Known gotchas

* Vite dev proxy only runs in dev. In prod you must serve the API separately or via serverless functions.
* `db.json` is fine for local hacking, not for real users or serverless hosts.
* Razorpay secrets must stay on the server. Never expose `RAZORPAY_KEY_SECRET` to the client.
* Cloudinary unsigned presets can be abused if public. Consider signed uploads for production.

---

## Contributing

1. Fork and clone.
2. Create a feature branch.
3. Lint/format (add ESLint + Prettier if not already in place).
4. Open a pull request describing what and why.

---

## License

MIT (or add your chosen license here). See `LICENSE` if present.

---

## Roadmap / nice-to-haves

- Swap JSON file DB for Postgres or Redis
- Add auth so wishes are tied to accounts
- Admin dashboard to approve or flag wishes
- Real-time updates via Pusher/Ably or WebSockets on a long-lived server
- Unit/integration tests (Vitest for client, Jest/Supertest for server)
- Accessibility pass (focus states, ARIA labels)
