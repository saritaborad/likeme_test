const express = require("express");
const { fetchHostApplications, viewHost, requestUserById, RejectHost } = require("../controllers/Request");
const { authenticate } = require("../middleware/auth");
const { reqired } = require("../middleware/validateField");
const router = express.Router();

router.post("/fetchHostApplications", authenticate, fetchHostApplications);
router.post("/viewHost", authenticate, reqired("_id"), viewHost);
router.post("/requestUserById", authenticate, reqired("_id"), requestUserById);
router.post("/RejectHost", authenticate, reqired("_id"), RejectHost);

module.exports = router;
