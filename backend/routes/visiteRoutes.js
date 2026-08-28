const express = require("express");
const router = express.Router();

const VisiteController = require("../controllers/VisiteController");

router.get("/", VisiteController.getAll);
router.get("/:id", VisiteController.getById);

module.exports = router;