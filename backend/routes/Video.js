const express = require("express");
const { deleteVideoById, videoById, fetchHostVideos, acceptVideoReview, fetchAllVideoReview, rejectVideoReview } = require("../controllers/Video");
const { authenticate } = require("../middleware/auth");
const { reqired } = require("../middleware/validateField");
const router = express.Router();

router.post("/deleteVideoById", authenticate, reqired("_id"), deleteVideoById);
router.post("/videoById", authenticate, videoById);
router.post("/fetchHostVideos", authenticate, fetchHostVideos);
router.post("/fetchAllVideoReview", authenticate, fetchAllVideoReview);
router.post("/acceptVideoReview", authenticate, reqired("_id"), acceptVideoReview);
router.post("/rejectVideoReview", authenticate, reqired("_id"), rejectVideoReview);

module.exports = router;
