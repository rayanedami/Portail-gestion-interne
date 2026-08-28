const express = require("express");

const router = express.Router();

const BadgeController = require("../controllers/BadgeController");

router.get("/", BadgeController.getAll);

router.get("/:id", BadgeController.getById);

module.exports = router;