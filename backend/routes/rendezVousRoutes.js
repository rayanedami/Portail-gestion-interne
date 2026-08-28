const express = require("express");
const router = express.Router();

const RendezVousController = require("../controllers/RendezVousController");

router.get("/", RendezVousController.getAll);
router.get("/:id", RendezVousController.getById);

module.exports = router;