const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const DB_FILE = "./data.json";

function loadData() {
    if (!fs.existsSync(DB_FILE)) {
        return {
            sessions: {}
        };
    }

    return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveData(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.post("/track", (req, res) => {

    const {
        sessionId,
        step,
        stepName,
        completed
    } = req.body;

    const db = loadData();

    if (!db.sessions[sessionId]) {
        db.sessions[sessionId] = {
            sessionId,
            maxStep: 0,
            completed: false,
            lastSeen: new Date().toISOString()
        };
    }

    db.sessions[sessionId].maxStep = step;
    db.sessions[sessionId].completed = completed;
    db.sessions[sessionId].lastSeen = new Date().toISOString();
    db.sessions[sessionId].stepName = stepName;

    saveData(db);

    res.json({ ok: true });
});

app.get("/stats", (req, res) => {

    const db = loadData();

    const sessions = Object.values(db.sessions);

    const started = sessions.length;

    const completed = sessions.filter(
        s => s.completed === true
    ).length;

    const dropoffs = {};

    sessions.forEach(s => {

        if (!s.completed) {

            const key = `${s.maxStep}/7`;

            dropoffs[key] =
                (dropoffs[key] || 0) + 1;
        }
    });

    res.json({
        started,
        completed,
        conversion:
            started > 0
                ? ((completed / started) * 100).toFixed(1)
                : 0,
        dropoffs,
        sessions
    });
});

app.listen(3001, () => {
    console.log("Analytics running on :3001");
});