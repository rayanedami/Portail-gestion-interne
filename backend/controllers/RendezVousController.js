const RendezVous = require("../models/RendezVous");

const RendezVousController = {

    async create(req, res) {
        try {
            const rendezVous = await RendezVous.create(req.body);

            res.status(201).json({
                message: "Rendez-vous créé avec succès",
                rendezVous
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
            const rendezVous = await RendezVous.update(
                req.params.id,
                req.body
            );

            if (!rendezVous) {
                return res.status(404).json({
                    message: "Rendez-vous introuvable"
                });
            }

            res.json({
                message: "Rendez-vous modifié avec succès",
                rendezVous
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
            const deleted = await RendezVous.delete(req.params.id);

            if (!deleted) {
                return res.status(404).json({
                    message: "Rendez-vous introuvable"
                });
            }

            res.json({
                message: "Rendez-vous supprimé avec succès"
            });

        } catch (error) {
            console.error(
                "Erreur suppression rendez-vous :",
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
            const rendezVous = await RendezVous.getById(req.params.id);

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