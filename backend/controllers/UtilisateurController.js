const Utilisateur = require("../models/Utilisateur");

const UtilisateurController = {

    async getAll(req, res) {
        try {
            const utilisateurs = await Utilisateur.getAll();

            res.json(utilisateurs);

        } catch (error) {
            console.error("Erreur récupération utilisateurs :", error.message);

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;

            const utilisateur = await Utilisateur.getById(id);

            if (!utilisateur) {
                return res.status(404).json({
                    message: "Utilisateur introuvable"
                });
            }

            res.json(utilisateur);

        } catch (error) {
            console.error("Erreur récupération utilisateur :", error.message);

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    }
};

module.exports = UtilisateurController;