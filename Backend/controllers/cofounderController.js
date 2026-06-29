// controllers/cofounderController.js

const db = require("../config/db");

const sendRequest = (req,res)=>{

    const senderId = req.user.id;

    const { receiverId } = req.body;

    db.query(
    `
    INSERT INTO cofounder_requests
    (sender_id,receiver_id)
    VALUES (?,?)
    `,
    [senderId,receiverId],
    (err,result)=>{

        if(err){
            return res.status(500).json(err);
        }

        res.json({
            message:"Request Sent"
        });
    });
};

const getRequests = (req,res)=>{

    const userId = req.user.id;

    db.query(
    `
    SELECT *
    FROM cofounder_requests
    WHERE receiver_id=?
    `,
    [userId],
    (err,result)=>{

        if(err){
            return res.status(500).json(err);
        }

        res.json(result);
    });
};

module.exports = {
sendRequest,
getRequests
};