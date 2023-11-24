const express = require("express");
const { report, deleteReport, fetchReports } = require("../controllers/Report");
const { reqired, isValidId } = require("../middleware/validateField");
const checkHeader = require("../middleware/checkHeader");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

router.post("/deleteReport", authenticate, reqired("_id"), deleteReport);
router.post("/fetchReports", authenticate, fetchReports);

// --------- android api ------------

router.post("/report", checkHeader, reqired("user_id", "reason", "description"), isValidId("user_id"), report);

module.exports = router;
