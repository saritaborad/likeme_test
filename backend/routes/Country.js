const express = require("express");
const router = express.Router();
const { fetchAllCountry, addCountry, updateCountry, country_list, deleteCountry } = require("../controllers/Country");
const checkHeader = require("../middleware/checkHeader");
const { authenticate } = require("../middleware/auth");
const { reqired } = require("../middleware/validateField");

router.post("/fetchAllCountry", authenticate, fetchAllCountry);
router.post("/addCountry", authenticate, reqired("country_name"), addCountry);
router.post("/updateCountry", authenticate, reqired("_id", "country_name"), updateCountry);
router.post("/deleteCountry", authenticate, reqired("_id"), deleteCountry);

// ------------- android api ------------

router.post("/country_list", checkHeader, country_list);

module.exports = router;
