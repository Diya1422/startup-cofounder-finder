const express=require("express");

const router=express.Router();

const {

applyToStartup,
getMyApplications

}=require("../controllers/applicationController");


router.post("/apply",applyToStartup);

router.get("/my/:id",getMyApplications);

module.exports=router;