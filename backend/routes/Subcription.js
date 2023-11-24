const express = require("express");
const { fetchAllCoinPlans, addSubcription, subcriptionById, updateSubcription, deleteSubcriptionById, allSubcription, default_flag } = require("../controllers/Subcription");
const checkHeader = require("../middleware/checkHeader");
const { authenticate } = require("../middleware/auth");
const { reqired } = require("../middleware/validateField");
const router = express.Router();

router.post("/fetchAllCoinPlans", authenticate, fetchAllCoinPlans);
router.post("/addSubcription", authenticate, reqired("price", "discount_price", "diamond", "play_store_id", "app_store_id", "orignal_sku", "highlight_text", "package_name"), addSubcription);
router.post("/subcriptionById", authenticate, subcriptionById);
router.post("/updateSubcription", authenticate, updateSubcription);
router.post("/deleteSubcriptionById", authenticate, reqired("_id"), deleteSubcriptionById);
router.post("/default_flag", authenticate, default_flag);

// ------------ android api ----------

router.post("/allSubcription", checkHeader, allSubcription);

module.exports = router;
