const Visite = require("../models/Visite");
const Notification = require("../models/Notification");
const Badge = require("../models/Badge");
const Log = require("../models/Log");

const VisiteController = {

    async create(req, res) {
        try {
            const qrCode = String(req.body.qr_code || "").trim();
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

            const existing = await Visite.findOpenByRendezVousId(badge.rendez_vous_id);
            if (existing) {
                return res.status(409).json({ message: "Ce visiteur est deja en visite", visite_id: existing.id });
            }

            const visite = await Visite.create({
                date_entree: req.body.date_entree || new Date(),
                date_sortie: null,
                statut: "EN_COURS",
                rendez_vous_id: badge.rendez_vous_id,
                agent_accueil_id: req.auth.id
            });
            await Badge.markUsed(badge.id);
            await Log.record({ action: `ENTREE_VISITEUR visite #${visite.id}`, utilisateurId: req.auth.id, req });

            await Notification.notifyVisitor(
                visite.rendez_vous_id,
                "Votre arrivée a été validée à l'accueil.",
                "VISITE"
            );

            res.status(201).json({
                message: "Visite créée avec succès",
                visite,
                badge: { ...badge, statut: "UTILISE" }
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
            const current = await Visite.getById(req.params.id);
            if (!current) {
                return res.status(404).json({ message: "Visite introuvable" });
            }

            const statut = String(req.body.statut || current.statut).toUpperCase();
            if (!["EN_ATTENTE", "EN_COURS", "TERMINEE", "ANNULEE"].includes(statut)) {
                return res.status(400).json({ message: "Statut de visite invalide" });
            }

            if (statut === "EN_COURS" && !(req.body.date_entree ?? current.date_entree)) {
                return res.status(400).json({ message: "Une date d'entrée est obligatoire pour une visite en cours" });
            }
            if (statut === "TERMINEE" && !(req.body.date_sortie ?? current.date_sortie)) {
                return res.status(400).json({ message: "Une date de sortie est obligatoire pour une visite terminée" });
            }

            const visite = await Visite.update(req.params.id, {
                date_entree: req.body.date_entree ?? current.date_entree,
                date_sortie: statut === "TERMINEE"
                    ? (req.body.date_sortie || new Date())
                    : (req.body.date_sortie ?? current.date_sortie),
                statut,
                rendez_vous_id: current.rendez_vous_id,
                agent_accueil_id: current.agent_accueil_id
            });

            if (visite && String(req.body.statut || "").toUpperCase() === "TERMINEE") {
                await Log.record({ action: `SORTIE_VISITEUR visite #${visite.id}`, utilisateurId: req.auth.id, req });
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
            const visites = await Visite.getAll(req.query);
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