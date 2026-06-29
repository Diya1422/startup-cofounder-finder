const db = require("../config/db");

// Apply to Startup
const applyToStartup = (req, res) => {

    const { startup_id, applicant_id } = req.body;

    if (!startup_id || !applicant_id) {
        return res.status(400).json({
            message: "Missing fields"
        });
    }

    const checkSql = `
        SELECT *
        FROM applications
        WHERE startup_id=? AND applicant_id=?
    `;

    db.query(checkSql,[startup_id, applicant_id],(err,result)=>{

        if(err){
            return res.status(500).json({
                message:"Database Error"
            });
        }

        if(result.length>0){
            return res.status(400).json({
                message:"You already applied"
            });
        }

        const insertSql=`
            INSERT INTO applications
            (startup_id, applicant_id)
            VALUES (?,?)
        `;

        db.query(insertSql,[startup_id, applicant_id],(err)=>{

            if(err){
                return res.status(500).json({
                    message:"Database Error"
                });
            }

            res.json({
                message:"Applied Successfully"
            });

        });

    });

};


// Get Logged-in User Applications
const getMyApplications = (req,res)=>{

    const applicantId=req.params.id;

    const sql=`
    SELECT

    startups.id,
    startups.title,
    startups.domain,
    startups.description,
    startups.required_skills,
    applications.status

    FROM applications

    INNER JOIN startups

    ON applications.startup_id=startups.id

    WHERE applications.applicant_id=?

    ORDER BY applications.id DESC
    `;

    db.query(sql,[applicantId],(err,result)=>{

        if(err){
            return res.status(500).json(err);
        }

        res.json(result);

    });

};


module.exports={

    applyToStartup,
    getMyApplications

};