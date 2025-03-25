import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { accessTokenSecret } from '../config.js'



//@desc register new user and add to database
//@route POST /api/auth/register
const register = async (req,res)=>{
    try {
        const {fullName, phone , email, password }=req.body;

        if (!fullName || !email ||!password ||!phone) {
            return res.status(422).json({message: "please fill in all fields"});
        }

        let user = await User.findOne({email});
        if(user){
           return res.status(400).json({message: "Account with same Email exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({fullName,phone,email,password:hashedPassword});
        await user.save();
        res.status(201).json({message: "User registered Successfully"});

        
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
}

//@desc login user
//@route POST /api/auth/login
const login = async (req,res)=>{
    try {
        const {email,password} = req.body;
        if (!email || !password) {
            return res.status(422).json({message:"Please fill in all the fields"})
        }
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({message: "Email or password is invalid"})   
        }
        const passwordMatch = await bcrypt.compare(password,user.password);
        if (!passwordMatch) {
            return res.status(401).json({message: "Email or password is invalid"})
        }

        const accessToken = jwt.sign({userId :user._id},accessTokenSecret);
        return res.status(200).json({id:user._id,name:user.fullName,email:user.email,accessToken})
    } catch (error) {
        return res.status(500).json({message : error.message});

    }
}

export {register,login} ;