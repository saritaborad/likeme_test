const express = require("express");
const { terms_conditions, privacy_policy, getPageData, addPageData, privacyPolicy } = require("../controllers/Pages");
const { authenticate } = require("../middleware/auth");
const { reqired } = require("../middleware/validateField");
const router = express.Router();

router.post("/addPageData", authenticate, reqired("description"), addPageData);
router.post("/getPageData", authenticate, getPageData);
router.post("/privacy_policy", authenticate, privacy_policy);
router.post("/terms_conditions", authenticate, terms_conditions);

// -------- android api ------------
router.get("/privacyPolicy", privacyPolicy);

module.exports = router;
