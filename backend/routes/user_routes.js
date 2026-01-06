const express=require("express")
const userRouter=express.Router()

const {getCurrentUser, updateUserLoaction} = require("../controllers/user_Controller")
const auth_middileware = require("../middleware/auth_middleware")



userRouter.get("/current",auth_middileware,getCurrentUser)
userRouter.post("/update-loaction",auth_middileware,updateUserLoaction)
module.exports=userRouter