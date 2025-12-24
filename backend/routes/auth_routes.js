const express=require("express")
const authRouter=express.Router()
const {signUp,signIn,signOut,sendOtp,sendotp, verifyOtp, resetPassword, googleAuth}=require("../controllers/auth_controller")


authRouter.post("/signup",signUp);
authRouter.post("/signin",signIn)
authRouter.get("/signout",signOut)
authRouter.post("/otp",sendOtp)
authRouter.post("/send-otp",sendotp);
authRouter.post("/verify-otp",verifyOtp);
authRouter.post("/change-password",resetPassword)
authRouter.post("/googleAuth",googleAuth)
module.exports=authRouter