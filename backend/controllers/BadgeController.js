const Badge = require("../models/Badge");
const Notification = require("../models/Notification");

const BadgeController = {

    async create(req, res) {
        try {
            const badge = await Badge.create(req.body);

            await Notification.notifyVisitor(
                badge.rendez_vous_id,
                "Votre badge numérique a été généré.",
                "BADGE"
            );

            res.status(201).json({
                message: "Badge créé avec succès",
                badge
            });

        } catch (error) {
            console.error("Erreur création badge :", error.message);

            const status = error.code === "ER_DUP_ENTRY" ? 409 : 400;
            res.status(status).json({
                message: error.code === "ER_DUP_ENTRY"
                    ? "Ce QR Code existe déjà. Générez un nouveau code."
                    : error.message
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
            const badges = await Badge.getAll(req.auth);

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
            const badge = await Badge.getById(req.params.id, req.auth);

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
    },

    async verify(req, res) {
        try {
            const qrCode = String(req.query.qr_code || "").trim();
            if (!qrCode) {
                return res.status(400).json({ message: "QR Code obligatoire" });
            }

            const badge = await Badge.getByQrCode(qrCode);
            if (!badge) {
                return res.status(404).json({ message: "Badge introuvable" });
            }
            if (badge.statut !== "VALIDE") {
                return res.status(409).json({ message: "Badge non valide", badge });
            }
            if (new Date(badge.date_expiration) <= new Date()) {
                return res.status(409).json({ message: "Badge expire", badge });
            }

            res.json({ message: "Badge valide", badge });
        } catch (error) {
            console.error("Erreur verification badge :", error.message);
            res.status(500).json({ message: "Erreur serveur" });
        }
    }
};

module.exports = BadgeController;