const db = require("../config/db");

const getAllStartups = (req, res) => {
    const sql = "SELECT * FROM startups";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(results);
    });
};

const createStartup = (req, res) => {
    const { title, description, domain, required_skills, created_by } = req.body;

    const sql = `
        INSERT INTO startups (title, description, domain, required_skills, created_by)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql,
        [title, description, domain, required_skills, created_by],
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.json({ message: "Startup created successfully" });
        }
    );
};

module.exports = {
    getAllStartups,
    createStartup
};