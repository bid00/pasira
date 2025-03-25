import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

//@desc Get current user data
//@route GET /api/user/getprofile
const getProfile = async(req,res)=>{
    try {
        const userid= req.user.id;
        const user = await User.findOne({ _id: userid});
        return res.status(200).json({
            id:user._id,
            fullName:user.fullName,
            email:user.email,
            phone:user.phone,
            picture: `${req.protocol}://${req.get("host")}${user.picture}`,
        })
    } catch (error) {

    return res.status(500).json({message:error.message});
        
    }
}

//@desc update user profile
//@route PATCH /api/user/updateprofile
const updateProfile = async(req,res)=>{
    try {
        const userId = req.user.id;
        const picture = req.file ? `/uploads/${req.file.filename}` : req.user.picture;
        if (req.body.email) {
            const existingUser = await User.findOne({email:req.body.email});
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(400).json({message:"Email already in use in another account"});
            }
        }
        await User.findByIdAndUpdate(userId,{
            $set:{
                fullName:req.body.fullName,
                email:req.body.email,
                phone:req.body.phone,
                picture              
            },
        },{new:true});
        return res.status(200).json({message:"Profile updated successfuly"})

        
    } catch (error) {
        return res.status(500).json({message:error.message});
        
    }
   

}

//@desc Change password for user
//@route PATCH /api/user/changepassword
const changePassword = async (req,res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        const {oldPassword,newPassword,cNewPassword}=req.body;
        if (!oldPassword || !newPassword ||!cNewPassword) {
            return res.status(422).json({message:"Please fill in all fields"})
        }
        const newPasswordHashed = await bcrypt.hash(newPassword,10);
        const passwordMatch = await bcrypt.compare(oldPassword,user.password);
        if (passwordMatch) {
            if (newPassword===cNewPassword) {
                await User.findByIdAndUpdate(userId,{
                    $set:{
                        password:newPasswordHashed
                    },
                },{new:true})
                return res.status(200).json({message:"Password updated successfuly"});
            }else{return res.status(422).json({message:"confirm password didn't match"})}
            
        }
        return res.status(422).json({message:"old password isn't true"})
        
       
        
    } catch (error) {
        return res.status(500).json({message:error.message})
        
        
    }
}
export {getProfile,updateProfile,changePassword};