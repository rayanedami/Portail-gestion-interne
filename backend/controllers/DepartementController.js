const Departement = require("../models/Departement");

const DepartementController = {
    async getAll(req, res) {
        try {
            return res.json(await Departement.getAll());
        } catch (error) {
            console.error("Erreur départements :", error.message);
            return res.status(500).json({ message: "Erreur serveur" });
        }
    }
};

module.exports = DepartementController;
