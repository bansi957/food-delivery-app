const express=require("express")
const shopRouter=express.Router()
const auth=require("../middleware/auth_middleware")
const {creatEditShop}=require("../controllers/shop_controller")
const multer=require("../middleware/multer")
shopRouter.post("/create-edit",auth,multer.single("image"),creatEditShop)

module.exports=shopRouter;