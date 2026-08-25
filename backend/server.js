const express = require("express");
const cors = require("cors");
const db = require("./config/db");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Portail Services API fonctionne"
    });
});

app.get("/test-db", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS test");

        res.json({
            message: "Connexion MySQL réussie",
            result: rows
        });
    } catch (error) {
        console.error("Erreur MySQL :", error.message);

        res.status(500).json({
            message: "Erreur de connexion MySQL"
        });
    }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});