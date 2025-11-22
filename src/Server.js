// src/server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const apiLinks = require("./routes/apiLinks");
const redirect = require("./routes/redirect");

const app = express();

// Enable CORS for frontend
app.use(cors({
    origin: "*",
    methods: "GET,POST,DELETE",
    allowedHeaders: "Content-Type"
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend (index.html + script.js)
app.use(express.static("public"));

// Health check
app.get("/healthz", (req, res) => {
    res.json({ ok: true });
});

// API routes
app.use("/api/links", apiLinks);

// Stats route (JSON response)
app.get("/code/:code", redirect.statsForCode);

// Redirect route (must be last)
app.get("/:code", redirect.redirectHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`TinyLink server running on port ${port}`);
});
