const express=require("express")
const shopRouter=express.Router()
const auth=require("../middleware/auth_middleware")
const {getMyShop}=require("../controllers/shop_controller")
const {creatEditShop}=require("../controllers/shop_controller")
const multer=require("../middleware/multer")


shopRouter.post("/create-edit",auth,multer.single("image"),creatEditShop)
shopRouter.get("/my-shop",auth,getMyShop)

module.exports=shopRouter;