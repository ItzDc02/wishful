import express from "express";
import cors from "cors";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import Razorpay from "razorpay";

dotenv.config();
const RAZORPAY_MODE = process.env.RAZORPAY_MODE || "test";
const app = express();
app.use(cors());
app.use(express.json());

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "..", "db.json");
function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Wishes CRUD
app.get("/api/wishes", (req, res) => {
  const db = readDB();
  res.json(db.wishes);
});

app.get("/api/wishes/:id", (req, res) => {
  const db = readDB();
  const wish = db.wishes.find((w) => w.id === req.params.id);
  if (!wish) return res.status(404).json({ error: "Not found" });
  res.json(wish);
});

app.post("/api/wishes", (req, res) => {
  const { title, description, imageUrl } = req.body;
  const db = readDB();
  const wish = {
    id: nanoid(),
    title,
    description,
    imageUrl,
    status: "pending",
    fulfilled: false,
    fulfilledBy: null,
  
     createdAt: Date.now(),};
  broadcast("wish:new", wish);
  db.wishes.push(wish);
  writeDB(db);
  res.status(201).json(wish);
});

app.post("/api/wishes/:id/fulfill", (req, res) => {
  const db = readDB();
  const wish = db.wishes.find((w) => w.id === req.params.id);
  if (!wish) return res.status(404).json({ error: "Not found" });
  if ((wish.status && wish.status !== "pending") || wish.fulfilled) {
    return res.status(400).json({ error: "Already fulfilled" });
  }
  wish.status = "fulfilled";
  wish.fulfilled = true;
  wish.fulfilledBy = req.body?.name || "Anonymous";
  writeDB(db);
  res.json({ ok: true });
});

// Razorpay test order
app.post("/api/payments/create-order", async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = req.body.amount || 100; // in paisa
    const options = {
      amount,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };
    const order = await instance.orders.create(options);
    res.json(order);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create order" });
  }
});

const PORT = process.env.PORT || 4000;

/* --- Social Features: Likes & Comments --- */

// Toggle like for a wish
app.post("/api/wishes/:id/like", (req, res) => {
  const { user = "anon" } = req.body || {};
  const wishId = req.params.id;
  const db = readDB();
  if (!db.likes) db.likes = [];
  const idx = db.likes.findIndex((l) => l.wishId === wishId && l.user === user);
  if (idx === -1) {
    db.likes.push({ id: nanoid(), wishId, user, createdAt: Date.now() });
  } else {
    db.likes.splice(idx, 1); // unlike
  }
  writeDB(db);
  const likesForWish = db.likes.filter((l) => l.wishId === wishId).length;
  res.json({ likes: likesForWish });
});

// Get likes count
app.get("/api/wishes/:id/likes", (req, res) => {
  const db = readDB();
  if (!db.likes) db.likes = [];
  const likesForWish = db.likes.filter(
    (l) => l.wishId === req.params.id
  ).length;
  res.json({ likes: likesForWish });
});

// Comments CRUD
app.get("/api/wishes/:id/comments", (req, res) => {
  const db = readDB();
  if (!db.comments) db.comments = [];
  const comments = db.comments
    .filter((c) => c.wishId === req.params.id)
    .sort((a, b) => a.createdAt - b.createdAt);
  res.json(comments);
});

app.post("/api/wishes/:id/comments", (req, res) => {
  const { user = "anon", text = "" } = req.body || {};
  if (!text.trim()) return res.status(400).json({ error: "Empty comment" });
  const db = readDB();
  if (!db.comments) db.comments = [];
  const comment = {
    id: nanoid(),
    wishId: req.params.id,
    user,
    text: text.trim(),
    createdAt: Date.now(),
  };
  broadcast("comment:new", comment);
  writeDB(db);
  res.json(comment);
});

import { createServer } from "http";
import { Server as IOServer } from "socket.io";

// --- Real-time with Socket.io ---
const httpServer = createServer(app);
const io = new IOServer(httpServer, { cors: { origin: "*" } });

function broadcast(event, payload) {
  io.emit(event, payload);
}

httpServer.listen(PORT, () =>
  console.log("HTTP+WS server on http://localhost:" + PORT)
);
