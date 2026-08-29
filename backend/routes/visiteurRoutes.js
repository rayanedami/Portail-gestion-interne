const express = require("express");
const router = express.Router();

const VisiteurController = require("../controllers/VisiteurController");

router.post("/", VisiteurController.create);
router.put("/:id", VisiteurController.update);
router.delete("/:id", VisiteurController.delete);

router.get("/", VisiteurController.getAll);
router.get("/:id", VisiteurController.getById);

module.exports = router;