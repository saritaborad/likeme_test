const express = require("express");
const { fetchAllPayment, addPayment, updatePayment, deletePaymentById, PaymentGetWayList } = require("../controllers/PaymentGetWay");
const checkHeader = require("../middleware/checkHeader");
const { authenticate } = require("../middleware/auth");
const { reqired } = require("../middleware/validateField");
const router = express.Router();

router.post("/fetchAllPayment", authenticate, fetchAllPayment);
router.post("/addPayment", authenticate, reqired("payment_getway"), addPayment);
router.post("/updatePayment", authenticate, reqired("_id"), updatePayment);
router.post("/deletePaymentById", authenticate, reqired("_id"), deletePaymentById);

// ----------- android api -----
router.post("/PaymentGetWayList", checkHeader, PaymentGetWayList);

module.exports = router;
