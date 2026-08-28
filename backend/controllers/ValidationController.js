const Validation = require("../models/Validation");

const ValidationController = {

    async getAll(req, res) {
        try {
            const validations = await Validation.getAll();
            res.json(validations);
        } catch (error) {
            console.error("Erreur validations :", error.message);
            res.status(500).json({ message: "Erreur serveur" });
        }
    },

    async getById(req, res) {
        try {
            const validation = await Validation.getById(req.params.id);

            if (!validation) {
                return res.status(404).json({
                    message: "Validation introuvable"
                });
            }

            res.json(validation);
        } catch (error) {
            console.error("Erreur validation :", error.message);
            res.status(500).json({ message: "Erreur serveur" });
        }
    }
};

module.exports = ValidationController;