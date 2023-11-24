const express = require("express");
const { getAdmobData } = require("../controllers/Ads");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

router.post("/getAdmobData", authenticate, getAdmobData);

module.exports = router;
