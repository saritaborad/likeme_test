const express = require("express");
const { fetchAllgifts, addGifts, editGift, deleteGift, giftList } = require("../controllers/Gifts");
const { uploadImage } = require("../middleware/upload");
const { authenticate } = require("../middleware/auth");
const checkHeader = require("../middleware/checkHeader");
const { reqired } = require("../middleware/validateField");
const router = express.Router();

router.post("/fetchAllgifts", authenticate, fetchAllgifts);
router.post("/addGifts", authenticate, uploadImage.single("images"), reqired("diamond"), addGifts);
router.post("/editGift", authenticate, uploadImage.single("images"), editGift);
router.post("/deleteGift", authenticate, reqired("_id"), deleteGift);

// ------------ android api --------------

router.post("/giftList", checkHeader, giftList);

module.exports = router;
