const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
// Import db directly if you intend to run raw queries in the router
const db = require("../config/db"); 

const {
    getDashboardStats,
    deleteStartup // 1. Import the delete function from your controller
} = require("../controllers/dashboardController");

router.get(
    "/stats",
    verifyToken,
    getDashboardStats
);

router.get("/stats/:userId", (req, res) => {
    const userId = req.params.userId;

    const sql = `
        SELECT 
        (SELECT COUNT(*) FROM startups WHERE created_by = ?) AS myStartups,
        (SELECT COUNT(*) FROM applications WHERE applicant_id = ?) AS applications
    `;

    db.query(sql, [userId, userId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result[0]);
    });
});

// 2. Add the delete route handler matching your frontend request format
router.delete("/delete/:id", deleteStartup);

module.exports = router;
