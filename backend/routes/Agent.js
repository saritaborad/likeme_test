const express = require("express");
const router = express.Router();
const { fetchAllagent, addAgent, editAgent, deleteAgent, fetchAgents, fetchAgentById } = require("../controllers/Agent");
const { uploadImage } = require("../middleware/upload");
const { getAgentHosts, fetchAllStreamHistory, fetchStreamHistoryDayWise, fetchAllHostHistory, fetchHostSummary, getHostAgents } = require("../controllers/AgentHost");
const { authenticate } = require("../middleware/auth");
const { reqired } = require("../middleware/validateField");

// router.post("/fetchAllagent", authenticate, fetchAllagent);
router.post("/addAgent", authenticate, reqired("name", "email_id", "password", "phone_no", "contry"), addAgent);
router.post("/editAgent", authenticate, uploadImage.single("images"), editAgent);
router.post("/deleteAgent", authenticate, reqired("_id"), deleteAgent);
router.post("/fetchAgents", authenticate, fetchAgents);
router.post("/fetchAgentById", authenticate, fetchAgentById);

router.post("/getAgentHosts", authenticate, getAgentHosts);
router.post("/getHostAgents", authenticate, getHostAgents);
router.post("/fetchAllStreamHistory", authenticate, fetchAllStreamHistory);
router.post("/fetchStreamHistoryDayWise", authenticate, fetchStreamHistoryDayWise);
router.post("/fetchAllHostHistory", authenticate, fetchAllHostHistory);
router.post("/fetchHostSummary", authenticate, fetchHostSummary);

module.exports = router;
