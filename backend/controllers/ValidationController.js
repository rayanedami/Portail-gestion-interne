const Validation = require("../models/Validation");
const Log = require("../models/Log");
const Notification = require("../models/Notification");

const ValidationController = {

    async decide(req, res) {
        try {
            const validation = await Validation.decide({
                ...req.body,
                responsable_id: req.auth.id
            });
            const decision = String(req.body.decision || "").toUpperCase();
            const commentaire = req.body.commentaire || "";
            if (decision.includes("REFUS")) {
                await Notification.notifyUser(
                    validation.collaborateur_id,
                    `Votre demande a été refusée. Motif : ${commentaire || "Non précisé"}`,
                    "VALIDATION",
                    validation.demande_id
                );
            } else if (validation.niveau === 1) {
                await Notification.notifyUser(
                    validation.collaborateur_id,
                    "Votre demande a été approuvée par le responsable.",
                    "VALIDATION",
                    validation.demande_id
                );
                await Notification.notifyUser(
                    validation.collaborateur_id,
                    "Votre demande a été transmise pour validation finale.",
                    "VALIDATION",
                    validation.demande_id
                );
                await Notification.notifyRole(
                    "RESPONSABLE",
                    "Une demande nécessite votre validation au niveau 2.",
                    "VALIDATION",
                    validation.demande_id,
                    null,
                    req.auth.id
                );
            } else {
                await Notification.notifyUser(
                    validation.collaborateur_id,
                    "Votre demande a été acceptée.",
                    "VALIDATION",
                    validation.demande_id
                );
            }
            await Log.record({
                action: `${decision.includes("REFUS") ? "REFUS_DEMANDE" : "VALIDATION_DEMANDE"} #${req.body.demande_id}`,
                utilisateurId: req.auth.id,
                req
            });
            return res.status(201).json({ message: "Décision enregistrée", validation });
        } catch (error) {
            console.error("Erreur décision validation :", error.message);
            return res.status(400).json({ message: error.message });
        }
    },

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