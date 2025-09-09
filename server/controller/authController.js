import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModels.js';
import transporter from '../config/nodemailer.js';


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETS, { expiresIn: "7d" });

    // Send token in response body AND cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email },
        message: "User registered successfully",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETS, { expiresIn: "7d" });

    // Send token in response body AND cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        token,
        user: { id: user._id, email: user.email, name: user.name },
        message: "Login success",
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const logout=async(req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production', 
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',

        });
        res.json({message:'logged out'});
        
    } catch (error) {
        res.status(400);
    }
}

export const sendVerifyOtp= async(req,res)=>{
    try {

        const {userId}=req.body;

        const user=await userModel.findById(userId);

        if(user.isAccountVerified){
            return res.status(404).json({message:'user is verified'})

        }

       const otp=String(Math.floor(100000+ Math.random()*900000));
       user.verifyOtp=otp;
       user.verifyOtpExpirAt=Date.now()+24*60*60*1000;

       await user.save();

       const mailOption={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Account Verfication OTP',
            text:`your account verification OTP is ${otp}`

       }

       await transporter.sendMail(mailOption);

       return res.json({message:'Verification OTP sent '});
        
    } catch (error) {
        res.json({message:'server error'})
        
    }
}

export const verifyEmail= async(req,res)=>{

    const {userId,otp}=req.body;

    if(!userId||!otp){
        res.status(404);
    }

    try {
        const user=await userModel.findById(userId); 
        if(!user){
            return res.json({message:'user not found'});
        }

        if(user.verifyOtp===''||user.verifyOtp!==otp){
            return res.json({message:"invalid OTP"});

        }
        if(user.verifyOtpExpirAt<Date.now()){
            return res.json({message:"otp expired"})
        }

        user.isAccountVerified=true;
        user.verifyOtp='';
        user.verifyOtpExpirAt=0;

        await user.save();

        return res.json({message:'Email verified'});

        
    } catch (error) {
        res.json({message:'server error'})
        
    }

}

export const isAuthenticated= async (req,res)=>{
    try {
        return res.status(200).json({message:'authenticated'})
        
    } catch (error) {
        res.json({message:'server error'})
        
    }
}


export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ message: "Email required" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ message: "User not found" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; 

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password reset OTP',
            text: `Your password reset OTP is ${otp}`
        };

        await transporter.sendMail(mailOption);

        res.json({ message: 'OTP sent to your email' });

    } catch (error) {
        console.error(error);
        res.json({ message: "Server error" });
    }
};


export const resetPassword= async(req,res)=>{
    const {email,otp,newpassowrd}=req.body;

    if(!email||!otp){
        res.json({message:'email or otp is invalid'});

    }

    try {
        const user =await user.userModel.findOne({email});

        if(!user){
            res.json({message:'user not found'});
        }

        if(user.resetOtp===''||user.resetOtp!==otp){
            res.json({message:'invalid otp'});

        }
        const hashedPassword=await bcrypt.hash(newpassowrd,10);
        user.password=hashedPassword;
        user.resetOtp='';
        user.resetOtpExpireAt=0;
        await user.save();
        return res.json({mesasge:'password reseted'});

        
    } catch (error) {
        res.status(500);
    }
}

