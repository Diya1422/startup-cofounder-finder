const mysql = require("mysql2");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "diyasharma@123",
    database: "startup_finder"
});
connection.connect((err) => {
    if (err) {
        console.log("❌ Database Connection Failed");
        console.log(err);
    } else {
        console.log("✅ MySQL Connected Successfully");
    }
});
module.exports = connection;