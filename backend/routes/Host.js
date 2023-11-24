const express = require("express");
const router = express.Router();
const { fetchHost_name, fetchHost_historyAPI, get_host_profile, fetchHostProfiles, hostProfileUpdate, hostblock, makeHost, fetchHosts, fetchAllFakeHost, hostById, applyForHost, fetchHostWorkhistory, featureUpdate, blockUnblockHost, addHostImages, addHostVideos, deleteHostById, hostUpdate, fetchHostProfiles_one_to_one, find_random_host, blockHost, unblockHost, get_host_profile_one_to_one, fetchHostProfilesNew } = require("../controllers/Host");
const { uploadImage, uploadVideo } = require("../middleware/upload");
const { fetchAllHost_historyApi } = require("../controllers/AgentHost");
const { reqired, isValidId } = require("../middleware/validateField");
const checkHeader = require("../middleware/checkHeader");
const { authenticate } = require("../middleware/auth");

router.post("/fetchHost_name", authenticate, fetchHost_name);
router.post("/blockUnblockHost", authenticate, blockUnblockHost);

router.post("/hostblock", authenticate, hostblock);
router.post("/makeHost", authenticate, makeHost);

router.post("/fetchHosts", authenticate, fetchHosts);
router.post("/fetchAllFakeHost", authenticate, fetchAllFakeHost);
router.post("/deleteHostById", authenticate, reqired("_id"), deleteHostById);
router.post("/featureUpdate", authenticate, featureUpdate);
router.post("/addHostImages", authenticate, uploadImage.array("images"), addHostImages);
router.post("/addHostVideos", authenticate, uploadVideo.array("video"), addHostVideos);
router.post("/hostUpdate", authenticate, hostUpdate);

router.post("/hostById", authenticate, hostById);
router.post("/fetchHostWorkhistory", authenticate, fetchHostWorkhistory);

//  ------------------ android api -----------------

router.post("/applyForHost", uploadImage.any(), checkHeader, reqired("id", "availabiltyHours", "billingAddress", "intrests", "about", "age", "email", "country_id", "diamond_per_min", "fullName"), isValidId("id", "country_id"), applyForHost);
router.post("/fetchHostProfiles", checkHeader, reqired("user_id"), isValidId("user_id"), fetchHostProfiles);
router.post("/hostProfileUpdate", uploadImage.any(), checkHeader, reqired("user_id"), hostProfileUpdate);
router.post("/get_host_profile", checkHeader, reqired("user_id", "host_id"), isValidId("user_id", "host_id"), get_host_profile);
router.post("/fetchHost_historyAPI", checkHeader, fetchHost_historyAPI);
router.post("/fetchHostProfiles_one_to_one", checkHeader, fetchHostProfiles_one_to_one);
router.post("/fetchAllHost_historyApi", checkHeader, reqired("id"), isValidId("id"), fetchAllHost_historyApi);
router.post("/get_host_profile_one_to_one", checkHeader, reqired("host_id"), isValidId("host_id"), get_host_profile_one_to_one);
router.post("/fetchHostProfilesNew", checkHeader, reqired("user_id"), isValidId("user_id"), fetchHostProfilesNew);
router.post("/find_random_host", checkHeader, reqired("user_id"), isValidId("user_id"), find_random_host);
router.post("/blockHost", checkHeader, reqired("user_id", "host_id"), isValidId("user_id", "host_id"), blockHost);
router.post("/unblockHost", checkHeader, reqired("user_id", "host_id"), isValidId("user_id", "host_id"), unblockHost);

module.exports = router;
