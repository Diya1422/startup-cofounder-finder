const db = require("../config/db");

const saveProfile = (req, res) => {

    const userId = req.user.id;

    const {
        college,
        course,
        bio,
        skills,
        github,
        linkedin
    } = req.body;

    const checkSql = "SELECT * FROM profiles WHERE user_id=?";

    db.query(checkSql, [userId], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.length > 0) {

            const updateSql = `
            UPDATE profiles
            SET
            college=?,
            course=?,
            bio=?,
            skills=?,
            github=?,
            linkedin=?
            WHERE user_id=?
            `;

            db.query(
                updateSql,
                [
                    college,
                    course,
                    bio,
                    skills,
                    github,
                    linkedin,
                    userId
                ],
                (err) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    res.json({
                        message: "Profile Updated"
                    });

                });

        }

        else {

            const insertSql = `
            INSERT INTO profiles
            (
            user_id,
            college,
            course,
            bio,
            skills,
            github,
            linkedin
            )
            VALUES (?,?,?,?,?,?,?)
            `;

            db.query(
                insertSql,
                [
                    userId,
                    college,
                    course,
                    bio,
                    skills,
                    github,
                    linkedin
                ],
                (err) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    res.json({
                        message: "Profile Saved"
                    });

                });

        }

    });

};

const getProfile = (req, res) => {

    const userId = req.user.id;

    const sql = `
    SELECT
    users.id,
    users.fullname,
    users.email,
    profiles.college,
    profiles.course,
    profiles.bio,
    profiles.skills,
    profiles.github,
    profiles.linkedin
    FROM users
    LEFT JOIN profiles
    ON users.id = profiles.user_id
    WHERE users.id=?
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result[0]);

    });

};

const getAllProfiles = (req, res) => {

    const sql = `
    SELECT
    users.id,
    users.fullname,
    profiles.college,
    profiles.course,
    profiles.skills,
    profiles.bio
    FROM users
    INNER JOIN profiles
    ON users.id=profiles.user_id
    ORDER BY users.fullname
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });

};

module.exports = {

    saveProfile,
    getProfile,
    getAllProfiles

};