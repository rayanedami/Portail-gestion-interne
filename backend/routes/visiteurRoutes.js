const express = require("express");
const router = express.Router();

const VisiteurController = require("../controllers/VisiteurController");

router.get("/", VisiteurController.getAll);
router.get("/:id", VisiteurController.getById);

module.exports = router;