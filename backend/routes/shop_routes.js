const express=require("express")
const shopRouter=express.Router()
const auth=require("../middleware/auth_middleware")
const {getMyShop, getShopByCity}=require("../controllers/shop_controller")
const {creatEditShop}=require("../controllers/shop_controller")
const multer=require("../middleware/multer")


shopRouter.post("/create-edit",auth,multer.single("image"),creatEditShop)
shopRouter.get("/my-shop",auth,getMyShop)
shopRouter.get("/get-by-city/:city",auth,getShopByCity)
module.exports=shopRouter;