const express=require("express")
const itemRouter=express.Router()
const auth=require("../middleware/auth_middleware")
const multer=require("../middleware/multer")
const {addItem,editItem}=require("../controllers/item_controller")


itemRouter.post("/add-item",auth,multer.single("image"),addItem)
itemRouter.put("/edit-item/:itemId",auth,multer.single("image"),editItem)
module.exports=itemRouter;