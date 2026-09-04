const Visiteur = require("../models/Visiteur");

const VisiteurController = {

    async create(req, res) {
        try {
            const visiteur = await Visiteur.create(req.body);

            res.status(201).json({
                message: "Visiteur créé avec succès",
                visiteur
            });

        } catch (error) {
            console.error("Erreur création visiteur :", error.message);

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    },

    async getHistory(req, res) {
        try {
            const historique = await Visiteur.getHistory(req.params.id);
            return res.json(historique);
        } catch (error) {
            console.error("Erreur historique visiteur :", error.message);
            return res.status(500).json({ message: "Erreur serveur" });
        }
    },

    async update(req, res) {
        try {
            const visiteur = await Visiteur.update(req.params.id, req.body);

            if (!visiteur) {
                return res.status(404).json({
                    message: "Visiteur introuvable"
                });
            }

            res.json({
                message: "Visiteur modifié avec succès",
                visiteur
            });

        } catch (error) {
            console.error("Erreur modification visiteur :", error.message);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await Visiteur.delete(req.params.id);

            if (!deleted) {
                return res.status(404).json({
                    message: "Visiteur introuvable"
                });
            }

            res.json({
                message: "Visiteur supprimé avec succès"
            });

        } catch (error) {
            console.error("Erreur suppression visiteur :", error.message);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    async getAll(req, res) {
        try {
            const visiteurs = await Visiteur.getAll(req.auth);
            res.json(visiteurs);
        } catch (error) {
            console.error("Erreur visiteurs :", error.message);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    async getById(req, res) {
        try {
            const visiteur = await Visiteur.getById(req.params.id);

            if (!visiteur) {
                return res.status(404).json({
                    message: "Visiteur introuvable"
                });
            }

            res.json(visiteur);
        } catch (error) {
            console.error("Erreur visiteur :", error.message);
            res.status(500).json({ message: "Erreur serveur" });
        }
    }
};

module.exports = VisiteurController;