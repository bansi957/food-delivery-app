const User=require("../models/user")
const bcrypt=require("bcryptjs")
const  jwtToken=require("../utils/token")

const jwt =require("jsonwebtoken")
const {sendOtpEmail} = require("../utils/mail")

// const sendOtp = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     const otpToken = jwt.sign(
//       { email, otp },
//       process.env.JWT_SECRET,
//       { expiresIn: "5m" }
//     );

//     await sendOtpEmail({
//       to: email,
//       sub: "Your Signup OTP",
//       otp
//     });

//     res.cookie("otpToken", otpToken, {
//       httpOnly: true,
//       maxAge: 5 * 60 * 1000,
//       sameSite: "none",
//       secure: true, // true in production
//     });

//     return res.status(200).json({ message: "OTP sent successfully" });
//   } catch (err) {
//     console.error("OTP ERROR:", err);
//     return res.status(500).json({ message: "OTP send failed" });
//   }
// };


const signUp=async(req,res)=>{
    try {

        const {fullName,email,password,mobile,role,otp}=req.body;
        let user=await User.findOne({email})
        if(user){
            return res.status(400).json({
                message:"this user is already exist please try with another email"
            })
        }
  
        
        if(password.length<6){
            return res.status(400).json({
                message:"pass is atlesat of 6 characters"
            })
        }

        if(mobile.length<10){
              return res.status(400).json({
                message:"mobile number must be 10 numbers"
            })
        }
        const salt= await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        
        user=await User.create({
            fullName,
            email,
            password:hashedPassword,
            mobile,
            role
        })
        const token=await jwtToken(user._id)
        res.cookie("token",token,{
            secure:true,
            sameSite:"none",
            maxAge:7*24*60*60*1000,
            httpOnly:true
        })
        return res.status(201).json({
            user
        })
    }
    catch (error) {
        return res.status(500).json({
            message:`signUp error ${error}`
        })
    }
}


const signIn=async(req,res)=>{
    try {
        const {email,password}=req.body;
        let user=await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message:"the email is invalid"
            })
        }

        const passMatch=await bcrypt.compare(password,user.password)
        if(!passMatch){
             return res.status(400).json({
                message:"password is incorrect"
            })
        }
       
        const token=await jwtToken(user._id)
        res.cookie("token",token,{
            secure:true,
            sameSite:"none",
            maxAge:7*24*60*60*1000,
            httpOnly:true
        })
        return res.status(200).json({
            user,
            token
        })
        }
     catch (error) {
        res.status(500).json({
            message:`signIn error ${error}`
        })
    }
}


const signOut=async (req,res)=>{
    try {
        res.clearCookie("token",{
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

        return res.status(200).json({
            message:"successfully logout"
        })
    } catch (error) {
           res.status(500).json({
            message:`signOut error ${error}`
        })
    }
}


const sendotp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    user.isOtpVerified = false;
    await user.save();

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY missing in production!");
      return res.status(500).json({ message: "Email service not configured" });
    }

    try {
      await sendOtpEmail({
        to: email,
        otp,
        sub: "Your OTP for password reset",
      });
    } catch (err) {
      console.error("Failed to send OTP email:", err);
      return res.status(500).json({
        message: "Failed to send OTP email",
        error: err.message,
      });
    }

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("sendotp ERROR:", err);
    return res.status(500).json({
      message: "Internal server error while sending OTP",
      error: err.message,
    });
  }
};


const verifyOtp=async (req,res)=>{
   try {
     const {email,otp}=req.body
    const user=await User.findOne({email})
    if(!user || user.resetOtp!=otp || user.otpExpires<Date.now()){
         return res.status(400).json({
                message:"invalid OTP"
            })
    }

    user.isOtpVerified=true
    user.resetOtp=undefined
    user.otpExpires=undefined
    await user.save();
     return  res.status(200).json({
                message:"successfully otp has verified"
            })
   } catch (error) {
     console.log(error)
        res.status(500).json({
            message:"something went wrong"
        })
   }
}

const resetPassword=async (req,res)=>{
   try {
     const {email,newpass}=req.body
    const user=await User.findOne({email})
    if(!user || !user.isOtpVerified){
         return res.status(400).json({
                message:"otp not verified"
            })
    }
    const hashedPass=await bcrypt.hash(newpass,10)
    user.password=hashedPass
    user.isOtpVerified=false
    await user.save()
     return  res.status(200).json({
                message:"successfully password has changed"
            })
   } catch (error) {
     console.log(error)
        res.status(500).json({
            message:"something went wrong"
        })
   }
}

const googleAuth=async (req,res)=>{
    try {
        const {fullName,email,mobile,role}=req.body
        let user=await User.findOne({email})
        if(!user){
            user=await User.create({
                fullName,
                email,
                role,
                mobile
            })
        }

         const token=await jwtToken(user._id)
        res.cookie("token",token,{
            secure:true,
            sameSite:"none",
            maxAge:7*24*60*60*1000,
            httpOnly:true
        })
  return  res.status(200).json({
                message:"successfully SignUp ",
                user
            })

    } catch (error) {
         console.log(error)
        res.status(500).json({
            message:"something went wrong"
        })
    }
}
module.exports={signUp,signIn,signOut,sendOtp,sendotp,verifyOtp,resetPassword,googleAuth}
