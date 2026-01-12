const express=require("express")
const itemRouter=express.Router()
const auth=require("../middleware/auth_middleware")
const multer=require("../middleware/multer")
const {addItem,editItem,getItemById, deleteItemById, getItemsByShopId, searchItems}=require("../controllers/item_controller")


itemRouter.post("/add-item",auth,multer.single("image"),addItem)
itemRouter.put("/edit-item/:itemId",auth,multer.single("image"),editItem)
itemRouter.get("/get-item/:itemId",auth,getItemById)
itemRouter.get("/delete/:itemId",auth,deleteItemById)
itemRouter.get("/get-by-shop/:shopId",auth,getItemsByShopId)
itemRouter.get("/search-items",auth,searchItems)


module.exports=itemRouter;