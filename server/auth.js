import express from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from "./models/user.js";
import cookieParser from "cookie-parser";


const router = express.Router();

router.use(cookieParser());

router.post("/register", async(req,res,next) => {
    const userExist = await User.findOne({username: req.body.username});
    
    if(userExist){
        res.send({message: "user already exist"});
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        username: req.body.username,
        password: hashedPassword
    });

    try{
        const saveUser = await user.save();
        res.status(200).send("user created");
    } catch (error) {
        res.status(500).send(error);
    }
});


router.post("/login", async(req,res) => {
    const user = await User.findOne({username: req.body.username})
    if(!user) {
        return res.status(400).send("Incorrect User"); 
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
        return res.status(400).send("Incorrect Password");
    }

    try{
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET,{ expiresIn: '400s' });
        // res.header("auth-token", token).send(token);
        const expiryTime = new Date((new Date()).getTime() + 400*1000);
        res.cookie('token', token, {httpOnly: true, expires: expiryTime });
        res.redirect("/login");
    } catch(error){
        res.status(500).send(error);
    }
   
});



export default router;

//module.exports = router;