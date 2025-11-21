// src/routes/apiLinks.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const Joi = require("joi");
const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet(
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    6
);

// Validation schema
const linkSchema = Joi.object({
    url: Joi.string().uri().required(),
    code: Joi.string().alphanum().min(6).max(8).optional()
});

// POST /api/links
router.post("/", async (req, res) => {
    const { error, value } = linkSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const { url } = value;
    const code = value.code || nanoid();

    try {
        const insert =
            "INSERT INTO links (code, url) VALUES ($1, $2) RETURNING code, url";
        const result = await db.query(insert, [code, url]);

        return res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === "23505") {
            return res.status(409).json({ error: "code already exists" });
        }
        console.error(err);
        return res.status(500).json({ error: "internal error" });
    }
});

// GET /api/links
router.get("/", async (req, res) => {
    try {
        const q =
            "SELECT code, url, total_clicks, last_clicked, created_at FROM links ORDER BY created_at DESC";
        const result = await db.query(q);
        return res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "internal error" });
    }
});

// GET /api/links/:code
router.get("/:code", async (req, res) => {
    const { code } = req.params;
    try {
        const q =
            "SELECT code, url, total_clicks, last_clicked, created_at FROM links WHERE code = $1";
        const result = await db.query(q, [code]);
        if (result.rowCount === 0)
            return res.status(404).json({ error: "not found" });

        return res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "internal error" });
    }
});

// DELETE /api/links/:code
router.delete("/:code", async (req, res) => {
    const { code } = req.params;
    try {
        const q = "DELETE FROM links WHERE code = $1";
        const result = await db.query(q, [code]);

        if (result.rowCount === 0)
            return res.status(404).json({ error: "not found" });

        return res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "internal error" });
    }
});

module.exports = router;
