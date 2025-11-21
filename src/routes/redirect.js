// src/routes/redirect.js
const db = require("../Db");

// GET /:code → redirect
async function redirectHandler(req, res) {
    const { code } = req.params;

    try {
        const result = await db.query("SELECT url FROM links WHERE code = $1", [
            code
        ]);

        if (result.rowCount === 0) return res.status(404).send("Not Found");

        const { url } = result.rows[0];

        // Update click stats
        await db.query(
            "UPDATE links SET total_clicks = total_clicks + 1, last_clicked = NOW() WHERE code = $1",
            [code]
        );

        return res.redirect(302, url);
    } catch (err) {
        console.error(err);
        return res.status(500).send("internal error");
    }
}

// GET /code/:code → stats JSON
async function statsForCode(req, res) {
    const { code } = req.params;

    try {
        const result = await db.query(
            "SELECT code, url, total_clicks, last_clicked, created_at FROM links WHERE code = $1",
            [code]
        );

        if (result.rowCount === 0)
            return res.status(404).json({ error: "not found" });

        return res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "internal error" });
    }
}

module.exports = {
    redirectHandler,
    statsForCode
};
