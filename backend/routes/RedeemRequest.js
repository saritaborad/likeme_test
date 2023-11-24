const express = require("express");
const { placeRedeemRequestAll, placeRedeemRequest, completeRedeem, fetchRedeemRequests, rejectRedeem, fetchRedeems, fetchAllRedeems } = require("../controllers/RedeemRequest");
const checkHeader = require("../middleware/checkHeader");
const { reqired, isValidId } = require("../middleware/validateField");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

router.post("/completeRedeem", authenticate, completeRedeem);
router.post("/fetchRedeems", authenticate, fetchRedeems);
router.post("/fetchAllRedeems", authenticate, fetchAllRedeems);
router.post("/rejectRedeem", authenticate, reqired("_id"), rejectRedeem);

//---------- android api -------------

router.post("/fetchRedeemRequests", checkHeader, reqired("user_id"), isValidId("user_id"), fetchRedeemRequests);
router.post("/placeRedeemRequest", checkHeader, reqired("user_id", "account_info", "payment_getway_title"), isValidId("user_id"), placeRedeemRequest);
router.post("/placeRedeemRequestAll", checkHeader, placeRedeemRequestAll);

module.exports = router;
