const Badge = require("../models/Badge");

const BadgeController = {

    async create(req, res) {
        try {
            const badge = await Badge.create(req.body);

            res.status(201).json({
                message: "Badge créé avec succès",
                badge
            });

        } catch (error) {
            console.error("Erreur création badge :", error.message);

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    },

    async update(req, res) {
        try {
            const badge = await Badge.update(
                req.params.id,
                req.body
            );

            if (!badge) {
                return res.status(404).json({
                    message: "Badge introuvable"
                });
            }

            res.json({
                message: "Badge modifié avec succès",
                badge
            });

        } catch (error) {
            console.error("Erreur modification badge :", error.message);

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await Badge.delete(req.params.id);

            if (!deleted) {
                return res.status(404).json({
                    message: "Badge introuvable"
                });
            }

            res.json({
                message: "Badge supprimé avec succès"
            });

        } catch (error) {
            console.error("Erreur suppression badge :", error.message);

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    },

    async getAll(req, res) {
        try {
            const badges = await Badge.getAll();

            res.json(badges);

        } catch (error) {
            console.error("Erreur badges :", error.message);

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    },

    async getById(req, res) {
        try {
            const badge = await Badge.getById(req.params.id);

            if (!badge) {
                return res.status(404).json({
                    message: "Badge introuvable"
                });
            }

            res.json(badge);

        } catch (error) {
            console.error("Erreur badge :", error.message);

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    }
};

module.exports = BadgeController;