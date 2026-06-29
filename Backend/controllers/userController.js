const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// REGISTER USER
const registerUser = async (req, res) => {
    console.log("DATA RECEIVED:", req.body);
    try {
        const { fullname, email, password } = req.body;
        if (!fullname || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `
            INSERT INTO users (fullname, email, password)
            VALUES (?, ?, ?)
        `;
        console.log("FINAL VALUES:");
        console.log("fullname:", fullname);
        console.log("email:", email);
        console.log("password:", password);
        console.log("hashedPassword:", hashedPassword);
        db.query(sql, [fullname, email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        message: "User already exists. Please login."
                    });
                }
                return res.status(500).json({
                    message: "Database error"
                });
            }
            console.log("INSERT SUCCESS:", result);
            return res.status(201).json({
                message: "User Registered Successfully"
            });
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// LOGIN USER
const loginUser = (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, results) => {
        if(err){
            return res.status(500).json(err);
        }
        if (results.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
        const token = jwt.sign(
            {
                id:user.id,
                email:user.email
            },
            "secretkey",
            {
                expiresIn:"7d"
            }
        );
        res.json({
            message: "Login successful",
            token,
            user
        });
    });
};
module.exports = {
    registerUser,
    loginUser
};