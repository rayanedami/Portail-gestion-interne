const Badge = require("../models/Badge");

const BadgeController = {

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