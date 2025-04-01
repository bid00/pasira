import express from "express";
import jwt from 'jsonwebtoken';
import { accessTokenSecret } from "../config.js";
import { login, register } from "../controllers/authController.js";
import passport from "passport";
import cookie from "cookie";
const router = express.Router();

// Login
router.post('/login',login);

// register
router.post('/register',register);

//passport
router.get('/google', passport.authenticate("google", { scope: ["profile", "email"] }))
//@desc google callback
router.get('/google/callback',passport.authenticate("google",{session:false}),(req,res)=>{
    const token = req.user.token;
    res.setHeader('Set-Cookie', cookie.serialize('accessToken', token, {
        httpOnly: false,  // Set to true in production (prevents JavaScript access)
        secure: false,    // Set to true if using HTTPS
        sameSite: "lax",  // Controls cross-origin behavior
        path: "/"
    }));
    res.redirect("http://localhost:5500/auth.html");
});



export default router;