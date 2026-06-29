const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const db = require("./config/db"); // ✅ better
const profileRoutes = require("./routes/profileRoutes");

const userRoutes = require("./routes/userRoutes");
const startupRoutes = require("./routes/startupRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const cofounderRoutes=require("./routes/cofounderRoutes");
app.use(cors());
app.use(express.json());

// API ROUTES
app.use("/api/users", userRoutes);
app.use("/api/startups", startupRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/cofounders",cofounderRoutes);
// STATIC FRONTEND
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.send("🚀 Startup Finder Backend Running");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});