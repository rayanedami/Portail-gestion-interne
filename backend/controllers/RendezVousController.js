const RendezVous = require("../models/RendezVous");

const RendezVousController = {

    async getAll(req, res) {
        try {
            const rendezVous = await RendezVous.getAll();
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