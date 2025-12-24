const express=require("express")
const userRouter=express.Router()

const getCurrentUser = require("../controllers/user_Controller")
const auth_middileware = require("../middleware/auth_middleware")



userRouter.get("/current",auth_middileware,getCurrentUser)

module.exports=userRouter