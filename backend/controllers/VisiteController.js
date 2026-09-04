const Visite = require("../models/Visite");
const Notification = require("../models/Notification");
const Badge = require("../models/Badge");

const VisiteController = {

    async create(req, res) {
        try {
            const visite = await Visite.create(req.body);
            const badge = await Badge.createForRendezVous(visite.rendez_vous_id);

            await Notification.notifyVisitor(
                visite.rendez_vous_id,
                "Votre arrivée a été validée à l'accueil.",
                "VISITE"
            );

            res.status(201).json({
                message: "Visite créée avec succès",
                visite,
                badge
            });

        } catch (error) {
            console.error("Erreur création visite :", error.message);

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    },

    async update(req, res) {
        try {
            const visite = await Visite.update(
                req.params.id,
                req.body
            );

            if (visite && String(req.body.statut || "").toUpperCase() === "TERMINEE") {
                await Notification.notifyVisitor(
                    visite.rendez_vous_id,
                    "Votre visite est terminée.",
                    "VISITE"
                );
            }

            if (!visite) {
                return res.status(404).json({
                    message: "Visite introuvable"
                });
            }

            res.json({
                message: "Visite modifiée avec succès",
                visite
            });

        } catch (error) {
            console.error("Erreur modification visite :", error.message);

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await Visite.delete(req.params.id);

            if (!deleted) {
                return res.status(404).json({
                    message: "Visite introuvable"
                });
            }

            res.json({
                message: "Visite supprimée avec succès"
            });

        } catch (error) {
            console.error("Erreur suppression visite :", error.message);

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    },

    async getAll(req, res) {
        try {
            const visites = await Visite.getAll();
            return res.json(visites);
        } catch (error) {
            console.error("Erreur visites :", error.message);
            return res.status(500).json({ message: "Erreur serveur" });
        }
    },

    async getById(req, res) {
        try {
            const visite = await Visite.getById(req.params.id);

            if (!visite) {
                return res.status(404).json({ message: "Visite introuvable" });
            }

            return res.json(visite);
        } catch (error) {
            console.error("Erreur visite :", error.message);
            return res.status(500).json({ message: "Erreur serveur" });
        }
    }
};

module.exports = VisiteController;