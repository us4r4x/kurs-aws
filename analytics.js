const express = require("express");
const path = require("path");

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// frontend static
app.use(express.static(path.join(__dirname, "public")));

// in-memory storage (MVP analytics)
let events = [];

/**
 * TRACKING ENDPOINT
 * odbiera eventy z formularza
 */
app.post("/track", (req, res) => {
  console.log("TRACK:", req.body);

  events.push({
    ...req.body,
    time: new Date().toISOString()
  });

  res.json({ ok: true });
});

/**
 * ADMIN DATA API
 */
app.get("/admin/data", (req, res) => {
  res.json(events);
});

/**
 * FRONTEND ROUTES
 */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

/**
 * HEALTH CHECK (debug na Render)
 */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    events: events.length
  });
});

/**
 * START SERVER
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
