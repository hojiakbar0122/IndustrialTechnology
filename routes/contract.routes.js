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

const router = require("express").Router();

router.post("/", addNewContract);
router.post("/rentedtechs", getRentedTechsByDateRange);
router.post("/damagedtechclients", getDamagedTechClientsByDate);
router.post("/cancelledcontractclients", getCancelledContractClientsByDate);

router.get("/", getAllContracts);
router.get("/:id", getContractById);
router.put("/:id", updateContractById);
router.delete("/:id", deleteContractById);

module.exports = router;
