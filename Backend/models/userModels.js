
import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            require:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        verifyOtp:{
            type:String,
            default:''
        },
        verifyOtpExpirAt:{
            type:Number,
            default:0
        },
        isAccountVerified:{
            type:Boolean,
            default:false

        },
        resetOtp:{
            type:String,
            default:''
        },
        resetOtpExpireAt:{
            type:Number,
            default:0
        }
    }
)

const userModel= mongoose.models.user||mongoose.model('users',userSchema);

export default userModel;

