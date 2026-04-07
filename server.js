const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve HTML/JS/CSS

// Conectar ao banco SQLite
const db = new sqlite3.Database("./database.db", (err) => {
    if (err) console.error(err.message);
    else console.log("Connected to SQLite database.");
});

// Criar tabela se não existir
db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        address TEXT,
        phone TEXT,
        city TEXT,
        country TEXT
    )
`);

// GET contatos
app.get("/contacts", (req, res) => {
    db.all("SELECT * FROM contacts", [], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

// POST contato
app.post("/contacts", (req, res) => {
    console.log("📥 POST recebido:", req.body); // Debug
    const { name, address, phone, city, country } = req.body;

    if (!name || !phone) return res.status(400).json({ error: "Name and Phone required!" });

    db.run(
        `INSERT INTO contacts (name, address, phone, city, country) VALUES (?, ?, ?, ?, ?)`,
        [name, address, phone, city, country],
        function(err) {
            if (err) return res.status(500).json(err);
            console.log("✅ Contato inserido com ID:", this.lastID);
            res.json({ id: this.lastID });
        }
    );
});

// PUT atualizar contato
app.put("/contacts/:id", (req, res) => {
    console.log("📥 PUT recebido:", req.body); // Debug
    const { name, address, phone, city, country } = req.body;

    db.run(
        `UPDATE contacts SET name=?, address=?, phone=?, city=?, country=? WHERE id=?`,
        [name, address, phone, city, country, req.params.id],
        function(err) {
            if (err) return res.status(500).json(err);
            console.log("✅ Contato atualizado, mudanças:", this.changes);
            res.json({ updated: this.changes });
        }
    );
});

// DELETE contato
app.delete("/contacts/:id", (req, res) => {
    db.run("DELETE FROM contacts WHERE id=?", req.params.id, function(err) {
        if (err) return res.status(500).json(err);
        console.log("❌ Contato deletado, mudanças:", this.changes);
        res.json({ deleted: this.changes });
    });
});

// Servir HTML
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Rodar servidor
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));