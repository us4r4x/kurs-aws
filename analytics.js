const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// storage (MVP)
let events = [];

// tracking
app.post("/track", (req, res) => {
  events.push({
    ...req.body,
    time: new Date().toISOString()
  });

  res.json({ ok: true });
});

// admin API
app.get("/admin/data", (req, res) => {
  res.json(events);
});

// pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("running on", PORT);
});
