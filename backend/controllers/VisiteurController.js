const Visiteur = require("../models/Visiteur");

const VisiteurController = {

    async getAll(req, res) {
        try {
            const visiteurs = await Visiteur.getAll();
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