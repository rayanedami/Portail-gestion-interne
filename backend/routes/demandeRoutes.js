const express = require("express");

const router = express.Router();

const DemandeController = require("../controllers/DemandeController");

router.get("/", DemandeController.getAll);

router.get("/:id", DemandeController.getById);

module.exports = router;