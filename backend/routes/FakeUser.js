const express = require("express");
const { addfakeUser, fetchAllFakeUser } = require("../controllers/FakeUser");
const router = express.Router();
const { uploadImage } = require("../middleware/upload");
const { authenticate } = require("../middleware/auth");
const { reqired } = require("../middleware/validateField");

router.post("/addfakeUser", authenticate, uploadImage.fields([{ name: "video" }, { name: "images" }]), reqired("country_id", "about", "bio", "age", "fullName"), addfakeUser);
router.post("/fetchAllFakeUser", authenticate, fetchAllFakeUser);

module.exports = router;
