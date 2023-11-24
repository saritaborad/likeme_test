const express = require("express");
const { login, logout, addRelationalDB, addNormalDB, changeArrOfDb, addUserIdToDB, changeJSON, deleteDuplicateFromUser, changeImage } = require("../controllers/Admin");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/addRelationalDB", authenticate, addRelationalDB);
router.post("/addNormalDB", authenticate, addNormalDB);
router.post("/changeArrOfDb", authenticate, changeArrOfDb);
router.post("/addUserIdToDB", authenticate, addUserIdToDB);
router.post("/changeJSON", authenticate, changeJSON);
router.post("/deleteDuplicateFromUser", authenticate, deleteDuplicateFromUser);
router.post("/changeImage", authenticate, changeImage);

module.exports = router;
