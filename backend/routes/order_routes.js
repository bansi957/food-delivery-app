const express=require("express");
const {placeOrder, getUserOrders, updateOrderstatus, getDeliveryBoyAssignment} = require("../controllers/order_controller");
const auth=require("../middleware/auth_middleware")

const orderRouter=express.Router()


orderRouter.post("/place-order",auth,placeOrder)
orderRouter.get("/my-orders",auth,getUserOrders)
orderRouter.post("/update-status/:orderId/:shopId",auth,updateOrderstatus)
orderRouter.get("/get-assignments",auth,getDeliveryBoyAssignment)


module.exports=orderRouter;