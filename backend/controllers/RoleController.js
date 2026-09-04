const Role = require("../models/Role");

module.exports = {
    async getAll(req, res) {
        try {
            res.json(await Role.getAll());
        } catch (error) {
            console.error("Erreur rôles :", error.message);
            res.status(500).json({ message: "Erreur serveur" });
        }
    }
};