const express = require("express");
const { getSettingData, updateSettingApp, all_setting, updateAdmob, getAdmob, generateAgoraToken, editAgoraToken } = require("../controllers/Setting");
const checkHeader = require("../middleware/checkHeader");
const { authenticate } = require("../middleware/auth");
const { reqired } = require("../middleware/validateField");
const router = express.Router();

router.post("/getSettingData", authenticate, getSettingData);
router.post("/updateSettingApp", authenticate, updateSettingApp);
router.post("/updateAdmob", authenticate, reqired("type", "rewarded_id"), updateAdmob);
router.post("/getAdmob", authenticate, reqired("type"), getAdmob);

// ---------------- android api ---------------

router.get("/all_setting", checkHeader, all_setting);
router.post("/generateAgoraToken", checkHeader, reqired("channelName"), generateAgoraToken);
router.post("/editAgoraToken", checkHeader, editAgoraToken);

module.exports = router;
