const express = require("express");
const router = express.Router();

const ValidationController = require("../controllers/ValidationController");

router.get("/", ValidationController.getAll);
router.get("/:id", ValidationController.getById);

module.exports = router;