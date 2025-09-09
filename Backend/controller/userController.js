import userModel from "../models/userModels.js";
import { isAuthenticated } from "./authController.js";

export const getUserData= async(req,res)=>{
    try {
        const {userId}=req.body;

        const user =await userModel.findOne({email});

        if(!user){
            res.json({message:'user not found'});
        }
        
        res.json({
            success:true,
            userData:{
                name:user.name,
                isAuthenticated:user.isAuthenticated
            }
        })
    } catch (error) {
        res.status(500);

        
    }

}