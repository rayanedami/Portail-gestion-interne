const express = require("express");
const router = express.Router();

const PieceJointeController = require("../controllers/PieceJointeController");

router.post("/", PieceJointeController.create);
router.put("/:id", PieceJointeController.update);
router.delete("/:id", PieceJointeController.delete);
router.get("/", PieceJointeController.getAll);
router.get("/:id", PieceJointeController.getById);

module.exports = router;
