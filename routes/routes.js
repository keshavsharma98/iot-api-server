const express  = require("express");
const router = express.Router();

router.get("/",async (req,res,next) => {
    res.status(200).json({
        "message":"HELLO!!"
    })
});


router.get("/home",async (req,res,next) => {
    res.status(200).json({
        "message":"HELLO HOME!!"
    })
});

module.exports = router; 