const express = require("express");
const { fetchAllSpendHistory, fetchAllPurchaseHistory, getPackageName, fetchAllSortPurchased, notiSortPurchased } = require("../controllers/Purchase");
const { authenticate } = require("../middleware/auth");
const { reqired } = require("../middleware/validateField");
const router = express.Router();

router.post("/fetchAllPurchaseHistory", authenticate, fetchAllPurchaseHistory);
router.post("/fetchAllSpendHistory", authenticate, fetchAllSpendHistory);
router.post("/getPackageName", authenticate, getPackageName);
router.post("/fetchAllSortPurchased", authenticate, fetchAllSortPurchased);
router.post("/notiSortPurchased", authenticate, reqired("_id", "message", "description"), notiSortPurchased);

module.exports = router;
