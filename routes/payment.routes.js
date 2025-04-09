const { addNewPayment, getAllPayments, getPaymentById, updatePaymentById, deletePaymentById, getClientPayments} = require("../controllers/payment.controller");

const router = require("express").Router();

router.post("/", addNewPayment);
router.post("/clientpayments", getClientPayments);

router.get("/", getAllPayments);
router.get("/:id", getPaymentById);
router.put("/:id", updatePaymentById);
router.delete("/:id", deletePaymentById);

module.exports = router;
