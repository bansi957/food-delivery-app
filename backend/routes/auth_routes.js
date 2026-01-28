const express=require("express")
const authRouter=express.Router()
const {signUp,signIn,signOut,sendotp, verifyOtp, resetPassword,googleLogin,googleSignup}=require("../controllers/auth_controller")


authRouter.post("/signup",signUp);
authRouter.post("/signin",signIn)
authRouter.get("/signout",signOut)

authRouter.post("/send-otp",sendotp);
authRouter.post("/verify-otp",verifyOtp);
authRouter.post("/change-password",resetPassword)
authRouter.post("/googleAuth",googleSignup)
authRouter.post("/googleAuth-signin",googleLogin)

module.exports=authRouter
