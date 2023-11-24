const express = require("express");
const { fetchAllReportReson, addReportReson, updateReportReson, deleteReportReson, reportReson } = require("../controllers/ReportReason");
const checkHeader = require("../middleware/checkHeader");
const { authenticate } = require("../middleware/auth");
const { reqired } = require("../middleware/validateField");
const router = express.Router();

router.post("/fetchAllReportReson", authenticate, fetchAllReportReson);
router.post("/addReportReson", authenticate, reqired("title"), addReportReson);
router.post("/updateReportReson", authenticate, reqired("_id", "title"), updateReportReson);
router.post("/deleteReportReson", authenticate, reqired("_id"), deleteReportReson);

// ---------------- android api ----------------

router.post("/reportReson", checkHeader, reportReson);

module.exports = router;
