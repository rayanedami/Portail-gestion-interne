const Validation = require("../models/Validation");

const ValidationController = {

    async create(req, res) {
        try {
            const {
                demande_id,
                responsable_id,
                niveau,
                decision,
                commentaire
            } = req.body;

            if (!demande_id || !responsable_id || !niveau || !decision) {
                return res.status(400).json({
                    message: "Les champs demande_id, responsable_id, niveau et decision sont obligatoires"
                });
            }

            const validation = await Validation.create(req.body);

            res.status(201).json({
                message: "Validation créée avec succès",
                validation
            });

        } catch (error) {
            console.error("Erreur création validation :", error.message);

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    },

    async update(req, res) {
        try {
            const validation = await Validation.update(
                req.params.id,
                req.body
            );

            if (!validation) {
                return res.status(404).json({
                    message: "Validation introuvable"
                });
            }

            res.json({
                message: "Validation modifiée avec succès",
                validation
            });

        } catch (error) {
            console.error("Erreur modification validation :", error.message);

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await Validation.delete(req.params.id);

            if (!deleted) {
                return res.status(404).json({
                    message: "Validation introuvable"
                });
            }

            res.json({
                message: "Validation supprimée avec succès"
            });

        } catch (error) {
            console.error("Erreur suppression validation :", error.message);

            res.status(500).json({
                message: "Erreur serveur"
            });
        }
    },

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