
# Wishful (Local Prototype)

A tiny full-stack playground where people post wishes and anonymous donors fulfill them with **Razorpay test payments**. Images go to **Cloudinary** using unsigned uploads. No paid services, no credit cards.

---

## 1. Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express (JS), local JSON file as DB (`server/db.json`)
- **Payments**: Razorpay **sandbox** only
- **Images**: Cloudinary free tier with unsigned preset
- **Auth**: Minimal demo-only (client-side context)

---

## 2. Prerequisites

- Node.js ≥ 18
- npm or pnpm
- Razorpay test account (no card required) for key id/secret
- Cloudinary free account for unsigned upload preset

---

## 3. Setup Steps

### 3.1 Clone & Install

```bash
git clone <your-fork-or-local-path> wishful
cd wishful
```

#### Frontend
```bash
cd client
cp .env.example .env
# Fill in: VITE_RAZORPAY_KEY_ID, VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UNSIGNED_PRESET
npm install
npm run dev
```

#### Backend
Open a new terminal:

```bash
cd server
cp .env.example .env
# Fill in: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
npm install
npm run dev
```

Frontend will proxy `/api` to `http://localhost:4000`.

---

## 4. Razorpay (Test Mode)

1. Sign up at Razorpay and switch to **Test Mode**
2. Get **Key ID** and **Key Secret** from Dashboard → Settings
3. Paste into `server/.env` and `client/.env` (only the key id on client)
4. Use Razorpay’s provided **test card / UPI IDs** in checkout modal

> This app **never** hits live endpoints. Keep it that way.

---

## 5. Cloudinary (Unsigned Upload)

1. Create account → Settings → Upload → **Upload Presets**
2. Create unsigned preset (unsigned = yes)
3. Note your **cloud name** and **preset name**
4. Put them into `client/.env`
5. Images upload directly from browser to Cloudinary, returning a secure URL

---

## 6. Data Storage

- Wishes are written to `server/db.json`. It’s just a file.
- Delete it to “reset” the app
- For pure demo, you could switch to an in-memory array (change `readDB/writeDB` functions)

---

## 7. Typical Dev Workflow

1. Start backend: `npm run dev` in `/server`
2. Start frontend: `npm run dev` in `/client`
3. Visit `http://localhost:5173`

---

## 8. Known Limitations (By Design)

- No security hardening (CSRF, validation) beyond basics
- No real auth or user management
- Razorpay verification is simplified (sandbox only)
- No pagination or fancy UI libs

---

## 9. Folder Layout

```
wishful/
  client/        # React + TS + Vite app
  server/        # Express server + db.json
```

---

## 10. Next Steps / Ideas

- Add tags or categories to wishes
- Add “story” / updates for fulfilled wishes
- Swap JSON file for SQLite using better-sqlite3 (still local/free)
- Add Jest/Vitest for practice

---

Enjoy building!


## July 26, 2025 – Demo‑specific upgrades

**One Wish · One Fulfiller**

* Added `status` and `fulfilledBy` fields to wishes (`pending → fulfilled → archived`) so a wish can only be fulfilled once.
* Server now blocks any second attempt to fulfil an already‑fulfilled wish.

**Test‑only Payments**

* Introduced `RAZORPAY_MODE` env var (defaults to `test`).  
* The `/payments/create-order` endpoint refuses requests unless the mode is `test`, guaranteeing sandbox‑only transactions.

**Polished UI**

* Home, WishCard, and WishDetails respect the new status and hide the “Fulfil” button once done.
* Basic theming tidied: consistent fonts, spacing, and disabled button states.

**Typescript Types**

* Added `WishStatus` union and expanded `Wish` interface with `status` and `fulfilledBy`.

## Social Feed Features (July 2025)
Wishful now includes optional social interactions—likes and comments—plus avatars on each card. These features are demo-only and run entirely on the local JSON DB.

### Endpoints Added
```
POST   /api/wishes/:id/like       { user }
GET    /api/wishes/:id/likes
GET    /api/wishes/:id/comments
POST   /api/wishes/:id/comments   { user, text }
```

### Development
Run `npm run dev` in both client and server as before. The JSON DB will now store `likes` and `comments` arrays.
