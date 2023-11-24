const express = require("express");
const { fakeMessagesList, deleteMessageById, updateMessage, fetchAllMessages, addMessage } = require("../controllers/Message");
const { uploadImage } = require("../middleware/upload");
const checkHeader = require("../middleware/checkHeader");
const { authenticate } = require("../middleware/auth");
const { reqired } = require("../middleware/validateField");
const router = express.Router();

router.post("/fetchAllMessages", authenticate, fetchAllMessages);
router.post("/addMessage", authenticate, uploadImage.single("title"), addMessage);
router.post("/deleteMessageById", authenticate, reqired("_id"), deleteMessageById);
router.post("/updateMessage", authenticate, updateMessage);

//  ------------ android api -----------
router.get("/fakeMessagesList", checkHeader, fakeMessagesList);

module.exports = router;
