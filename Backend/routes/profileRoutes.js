const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth");

const {
    saveProfile,
    getProfile,
    getAllProfiles
} = require("../controllers/profileController");

router.post("/save", verifyToken, saveProfile);

router.get("/my", verifyToken, getProfile);

router.get("/all", getAllProfiles);

module.exports = router;