const express = require("express");

const router = express.Router();

const DemandeController = require("../controllers/DemandeController");

router.post("/", DemandeController.create);

router.get("/", DemandeController.getAll);

router.get("/:id", DemandeController.getById);

module.exports = router;