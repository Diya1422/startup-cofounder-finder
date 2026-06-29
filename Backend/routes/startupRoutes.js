const express = require("express");
const router = express.Router();

const {
    createStartup,
    getAllStartups
} = require("../controllers/startupController");

// CREATE STARTUP (THIS IS REQUIRED)
router.post("/create", createStartup);

// GET ALL STARTUPS
router.get("/", getAllStartups);

module.exports = router;