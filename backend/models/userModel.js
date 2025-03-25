import mongoose, { model } from "mongoose";
import bcrypt from 'bcryptjs';
import { type } from "os";

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required:true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    phone: {
        type: String,
        default:"",
    },
    picture:{
        type:String,
        default:"",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    googleId: { type: String }, 
});

const User = mongoose.model('Users',userSchema);

export default User;