const express = require("express");
const { sendNotification, notificationRemove, sendNotificationToUsers, adminSendNotification, fetchNotification, fetchAllNotification, updateNotification, deleteNotificationyById, getNotificationTable, getNotificationCredential, deleteNotificationCredential, updateNotificationCredential, addNotificationCredential, fetchNotificationAdmin, updateNotificationAdmin, addNotificationAdmin, deleteNotificationAdmin } = require("../controllers/Notification");
const checkHeader = require("../middleware/checkHeader");
const { reqired, isValidId } = require("../middleware/validateField");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.post("/sendNotification", sendNotification);
router.post("/notificationRemove", checkHeader, reqired("user_id"), isValidId("user_id"), notificationRemove);
router.post("/sendNotificationToUsers", checkHeader, sendNotificationToUsers);
router.post("/adminSendNotification", adminSendNotification);

router.post("/fetchAllNotification", authenticate, fetchAllNotification);
router.post("/updateNotification", authenticate, updateNotification);
router.post("/deleteNotificationyById", authenticate, reqired("_id"), deleteNotificationyById);

// ----------------- Notification Content Routes------

router.post("/addNotificationAdmin", authenticate, reqired("title", "description"), addNotificationAdmin);
router.post("/fetchNotificationAdmin", authenticate, fetchNotificationAdmin);
router.post("/updateNotificationAdmin", authenticate, reqired("_id", "title", "description"), updateNotificationAdmin);
router.post("/deleteNotificationAdmin", authenticate, reqired("_id"), deleteNotificationAdmin);

// ----------------- Notification Table Routes---------

router.post("/getNotificationTable", checkHeader, getNotificationTable);
router.post("/addNotificationCredential", authenticate, reqired("device_type", "fcm_key", "package_name"), addNotificationCredential);
router.post("/getNotificationCredential", authenticate, getNotificationCredential);
router.post("/updateNotificationCredential", authenticate, reqired("_id"), updateNotificationCredential);
router.post("/deleteNotificationCredential", authenticate, reqired("_id"), deleteNotificationCredential);

// ------------------ android api -------------------
router.post("/fetchNotification", checkHeader, reqired("start", "limit"), fetchNotification);

module.exports = router;
