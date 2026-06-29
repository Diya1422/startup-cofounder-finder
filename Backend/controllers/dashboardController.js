const db = require("../config/db");

// 1. Fetch live metrics for the user's dashboard view
const getDashboardStats = (req, res) => {
    const userId = req.user.id; // From your patched verifyToken middleware

    // Unified query batch to grab essential user metrics
    const queries = {
        myStartupsCount: "SELECT COUNT(*) AS total FROM startups WHERE created_by = ?",
        myApplicationsCount: "SELECT COUNT(*) AS total FROM applications WHERE applicant_id = ?",
        incomingApplicationsCount: `
            SELECT COUNT(*) AS total 
            FROM applications a
            JOIN startups s ON a.startup_id = s.id
            WHERE s.created_by = ? AND a.status = 'Pending'
        `
    };

    // Execute queries sequentially or using a nested pipeline pattern for MySQL compatibility
    db.query(queries.myStartupsCount, [userId], (err, startupsRes) => {
        if (err) return res.status(500).json({ error: "Failed to compile startup count." });

        db.query(queries.myApplicationsCount, [userId], (err, appsRes) => {
            if (err) return res.status(500).json({ error: "Failed to compile submitted applications." });

            db.query(queries.incomingApplicationsCount, [userId], (err, incomingRes) => {
                if (err) return res.status(500).json({ error: "Failed to compile pending action metrics." });

                // Respond with unified numeric telemetry payload
                return res.status(200).json({
                    startupsCreated: startupsRes[0].total,
                    applicationsSubmitted: appsRes[0].total,
                    pendingReviews: incomingRes[0].total
                });
            });
        });
    });
};

// 2. Delete a startup safely with identity/ownership validation checks
const deleteStartup = (req, res) => {
    const startupId = req.params.id;
    const userId = req.user.id; // Extracted safely from decoded login session web token

    // Step A: Fetch ownership confirmation before executing mutations
    const checkOwnershipSql = "SELECT created_by FROM startups WHERE id = ?";
    
    db.query(checkOwnershipSql, [startupId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Database infrastructure verification loop failed." });
        }
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "Requested startup post not found." });
        }

        const startupOwnerId = rows[0].created_by;

        // Step B: Terminate call immediately if current identity fails ownership cross-match
        if (parseInt(userId) !== parseInt(startupOwnerId)) {
            return res.status(403).json({ 
                message: "Access Blocked: You do not possess structural ownership permissions over this resource." 
            });
        }

        // Step C: Execute structural cascade-deletion string safely
        const deleteSql = "DELETE FROM startups WHERE id = ?";
        db.query(deleteSql, [startupId], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            return res.json({ message: "Startup post successfully wiped from live environment registers!" });
        });
    });
};

module.exports = {
    getDashboardStats,
    deleteStartup
};
