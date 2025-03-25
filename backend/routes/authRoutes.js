import express from "express";
import jwt from 'jsonwebtoken';
import { accessTokenSecret } from "../config.js";
import { login, register } from "../controllers/authController.js";
import passport from "passport";

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
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login Successful</title>
        </head>
        <body>
            <h2 id="message">Processing login...</h2>
            <script>
                document.addEventListener("DOMContentLoaded", function () {
                    localStorage.setItem("accessToken", "${token}");
                    document.getElementById("message").innerText = "Login successful! You can close this tab.";
                });
            </script>
        </body>
        </html>
    `);

});



export default router;