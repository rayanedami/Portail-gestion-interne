const express = require("express");

const router = express.Router();

const DemandeController = require("../controllers/DemandeController");
const { requireRoles } = require("../middleware/auth");

router.use(requireRoles("COLLABORATEUR", "RESPONSABLE", "ADMINISTRATEUR"));

router.post("/", DemandeController.create);
router.put("/:id", DemandeController.update);
router.delete("/:id", DemandeController.delete);

router.get("/", DemandeController.getAll);

router.get("/options", DemandeController.getOptions);

router.get("/:id", DemandeController.getById);

module.exports = router;