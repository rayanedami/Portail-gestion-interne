const Log = require("../models/Log");

const LogController = {

    async getAll(req, res) {
        try {
            const logs = await Log.getAll();
            res.json(logs);
        } catch (error) {
            console.error("Erreur logs :", error.message);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    async getById(req, res) {
        try {
            const log = await Log.getById(req.params.id);

            if (!log) {
                return res.status(404).json({
                    message: "Log introuvable"
                });
            }

            res.json(log);
        } catch (error) {
            console.error("Erreur log :", error.message);
            res.status(500).json({ message: "Erreur serveur" });
        }
    }
};

module.exports = LogController;