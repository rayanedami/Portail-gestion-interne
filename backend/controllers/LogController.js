const Log = require("../models/Log");

const LogController = {

    async create(req, res) {
        try {
            const log = await Log.create(req.body);

            res.status(201).json({
                message: "Log créé avec succès",
                log
            });

        } catch (error) {
            console.error("Erreur création log :", error.message);

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    },

    async update(req, res) {
        try {
            const log = await Log.update(
                req.params.id,
                req.body
            );

            if (!log) {
                return res.status(404).json({
                    message: "Log introuvable"
                });
            }

            res.json({
                message: "Log modifié avec succès",
                log
            });

        } catch (error) {
            console.error(
                "Erreur modification log :",
                error.message
            );

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await Log.delete(req.params.id);

            if (!deleted) {
                return res.status(404).json({
                    message: "Log introuvable"
                });
            }

            res.json({
                message: "Log supprimé avec succès"
            });

        } catch (error) {
            console.error(
                "Erreur suppression log :",
                error.message
            );

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    },

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