const express = require("express");
const { ImageById, deleteImageById, fetchHostImages, fetchAllImageReview, acceptImageReview, rejectImageReview } = require("../controllers/Image");
const { authenticate } = require("../middleware/auth");
const { reqired } = require("../middleware/validateField");
const router = express.Router();

router.post("/ImageById", authenticate, ImageById);
router.post("/deleteImageById", authenticate, reqired("_id"), deleteImageById);
router.post("/fetchHostImages", authenticate, fetchHostImages);
router.post("/fetchAllImageReview", authenticate, fetchAllImageReview);
router.post("/acceptImageReview", authenticate, acceptImageReview);
router.post("/rejectImageReview", authenticate, reqired("_id"), rejectImageReview);

module.exports = router;
