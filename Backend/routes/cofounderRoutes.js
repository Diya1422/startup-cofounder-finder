const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth");

const {
    sendRequest,
    getRequests
} = require("../controllers/cofounderController");

router.post("/send", verifyToken, sendRequest);

router.get("/requests", verifyToken, getRequests);

module.exports = router;