const {
  addNewContract,
  getAllContracts,
  getContractById,
  updateContractById,
  deleteContractById,
  getRentedTechsByDateRange,
  getDamagedTechClientsByDate,
  getCancelledContractClientsByDate,
} = require("../controllers/contract.controller");
const isClient = require("../middleware/guards/isClient.guard");
const verifyToken = require("../middleware/guards/verifyToken.guard");

const router = require("express").Router();

router.post("/", verifyToken, isClient, addNewContract);
router.post("/rentedtechs", getRentedTechsByDateRange);
router.post("/damagedtechclients", getDamagedTechClientsByDate);
router.post("/cancelledcontractclients", getCancelledContractClientsByDate);

router.get("/", getAllContracts);
router.get("/:id", getContractById);
router.put("/:id", verifyToken, isClient, updateContractById);
router.delete("/:id", verifyToken, isClient, deleteContractById);

module.exports = router;
