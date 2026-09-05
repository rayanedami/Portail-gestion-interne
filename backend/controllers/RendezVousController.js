const db = require("../config/db");
const RendezVous = require("../models/RendezVous");
const Notification = require("../models/Notification");
const Badge = require("../models/Badge");
const Log = require("../models/Log");

const RendezVousController = {

    async create(req, res) {
        try {
            const data = { ...req.body };

            if (req.auth.role === "COLLABORATEUR" || req.auth.role === "RESPONSABLE") {
                data.collaborateur_id = req.auth.id;
            }

            if (req.auth.role === "VISITEUR") {
                const [profils] = await db.query(
                    "SELECT id FROM visiteur WHERE utilisateur_id = ?",
                    [req.auth.id]
                );
                if (profils.length === 0) {
                    return res.status(400).json({ message: "Profil visiteur introuvable" });
                }
                data.visiteur_id = profils[0].id;
            }

            if (!data.date_rendez_vous || !data.heure_rendez_vous || !data.visiteur_id || !data.collaborateur_id) {
                return res.status(400).json({
                    message: "Date, heure, visiteur et collaborateur sont obligatoires"
                });
            }

            data.statut = data.statut || "PLANIFIE";

            const rendezVous = await RendezVous.create(data);
            await Log.record({ action: `CREATION_RENDEZ_VOUS #${rendezVous.id}`, utilisateurId: req.auth.id, req });
            await Notification.notifyReception(
                "Un nouveau rendez-vous visiteur a été enregistré.",
                "RENDEZ_VOUS",
                rendezVous.id
            );
            if (String(data.date_rendez_vous).slice(0, 10) === new Date().toISOString().slice(0, 10)) {
                await Notification.notifyReception(
                    `Un visiteur est attendu aujourd'hui à ${String(data.heure_rendez_vous).slice(0, 5)}.`,
                    "VISITEUR_ATTENDU",
                    rendezVous.id
                );
            }
            let badge = null;
            if (String(data.statut).toUpperCase() === "CONFIRME") {
                badge = await Badge.createForRendezVous(rendezVous.id);
                await Log.record({ action: `GENERATION_BADGE rendez-vous #${rendezVous.id}`, utilisateurId: req.auth.id, req });
            }

            await Notification.notifyUser(
                data.collaborateur_id,
                `Un nouveau rendez-vous #${rendezVous.id} a été créé.`,
                "RENDEZ_VOUS",
                null,
                rendezVous.id
            );
            await Notification.notifyVisitor(
                rendezVous.id,
                `Votre rendez-vous #${rendezVous.id} a été créé.`,
                "RENDEZ_VOUS"
            );

            res.status(201).json({
                message: "Rendez-vous créé avec succès",
                rendezVous,
                badge
            });

        } catch (error) {
            console.error("Erreur création rendez-vous :", error.message);

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    },

    async update(req, res) {
        try {
            const existing = await RendezVous.getById(req.params.id, req.auth);

            if (!existing) {
                return res.status(404).json({
                    message: "Rendez-vous introuvable"
                });
            }

            const data = {
                date_rendez_vous: req.body.date_rendez_vous ?? existing.date_rendez_vous,
                heure_rendez_vous: req.body.heure_rendez_vous ?? existing.heure_rendez_vous,
                motif: req.body.motif ?? existing.motif,
                statut: req.body.statut ?? existing.statut,
                visiteur_id: existing.visiteur_id,
                collaborateur_id: existing.collaborateur_id
            };

            if (req.auth.role === "AGENT_ACCUEIL" || req.auth.role === "ADMINISTRATEUR") {
                data.visiteur_id = req.body.visiteur_id ?? existing.visiteur_id;
                data.collaborateur_id = req.body.collaborateur_id ?? existing.collaborateur_id;
            }

            const rendezVous = await RendezVous.update(req.params.id, data);

            const receptionMessage = String(data.statut).toUpperCase() === "ANNULE"
                ? "Un rendez-vous visiteur a été annulé."
                : "Un rendez-vous visiteur a été modifié.";
            await Notification.notifyReception(receptionMessage, "RENDEZ_VOUS", rendezVous.id);
            if (String(data.date_rendez_vous).slice(0, 10) === new Date().toISOString().slice(0, 10)) {
                await Notification.notifyReception(
                    `Un visiteur est attendu aujourd'hui à ${String(data.heure_rendez_vous).slice(0, 5)}.`,
                    "VISITEUR_ATTENDU",
                    rendezVous.id
                );
            }

            let badge = null;
            if (String(data.statut).toUpperCase() === "CONFIRME") {
                badge = await Badge.createForRendezVous(rendezVous.id);
            }

            await Notification.notifyVisitor(
                rendezVous.id,
                `Votre rendez-vous #${rendezVous.id} a été modifié.`,
                "RENDEZ_VOUS"
            );

            res.json({
                message: "Rendez-vous modifié avec succès",
                rendezVous,
                badge
            });

        } catch (error) {
            console.error(
                "Erreur modification rendez-vous :",
                error.message
            );

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    },

    async delete(req, res) {
        try {
            const existing = await RendezVous.getById(req.params.id, req.auth);

            if (!existing) {
                return res.status(404).json({
                    message: "Rendez-vous introuvable"
                });
            }

            const rendezVous = await RendezVous.cancel(req.params.id);

            await Notification.notifyReception(
                "Un rendez-vous visiteur a été annulé.",
                "RENDEZ_VOUS",
                rendezVous.id
            );

            await Notification.notifyVisitor(
                rendezVous.id,
                `Votre rendez-vous #${rendezVous.id} a été annulé.`,
                "RENDEZ_VOUS"
            );

            res.json({
                message: "Rendez-vous annulé avec succès",
                rendezVous
            });

        } catch (error) {
            console.error(
                "Erreur annulation rendez-vous :",
                error.message
            );

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    },

    async getAll(req, res) {
        try {
            const rendezVous = await RendezVous.getAll(req.auth);
            res.json(rendezVous);
        } catch (error) {
            console.error("Erreur rendez-vous :", error.message);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    async getById(req, res) {
        try {
            const rendezVous = await RendezVous.getById(req.params.id, req.auth);

            if (!rendezVous) {
                return res.status(404).json({
                    message: "Rendez-vous introuvable"
                });
            }

            res.json(rendezVous);
        } catch (error) {
            console.error("Erreur rendez-vous :", error.message);
            res.status(500).json({ message: "Erreur serveur" });
        }
    }
};

module.exports = RendezVousController;