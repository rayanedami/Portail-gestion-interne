const express = require("express");

const router = express.Router();

const BadgeController = require("../controllers/BadgeController");

router.post("/", BadgeController.create);
router.put("/:id", BadgeController.update);
router.delete("/:id", BadgeController.delete);

router.get("/", BadgeController.getAll);

router.get("/:id", BadgeController.getById);

module.exports = router;