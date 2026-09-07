const express = require("express");
const router = express.Router();
const StatistiqueController = require("../controllers/StatistiqueController");

router.get("/dashboard", StatistiqueController.getDashboard);

module.exports = router;