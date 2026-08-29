const express = require("express");

const router = express.Router();

const DemandeController = require("../controllers/DemandeController");

router.post("/", DemandeController.create);
router.put("/:id", DemandeController.update);
router.delete("/:id", DemandeController.delete);

router.get("/", DemandeController.getAll);

router.get("/:id", DemandeController.getById);

module.exports = router;