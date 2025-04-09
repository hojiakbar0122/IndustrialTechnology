const { addNewPassportData, getAllPassportDatas, getPassportDataById, updatePassportDataById, deletePassportDataById,} = require("../controllers/passport_data.controller")

const router = require("express").Router()

router.post("/", addNewPassportData)
router.get("/", getAllPassportDatas)
router.get("/:id", getPassportDataById)
router.put("/:id", updatePassportDataById)
router.delete("/:id", deletePassportDataById)

module.exports = router