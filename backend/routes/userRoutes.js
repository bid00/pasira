import express from "express";
import { changePassword, getProfile, updateProfile } from "../controllers/profileController.js";
import upload from "../middleware/upload.js";
const router = express.Router();

// Get Profile
router.get('/getprofile',getProfile);

// Update Profile
router.patch('/updateprofile',upload.single("picture"),updateProfile);

// change Password
router.patch('/changepassword',changePassword);

export default router;