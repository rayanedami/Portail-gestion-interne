const Visite = require("../models/Visite");

const VisiteController = {

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