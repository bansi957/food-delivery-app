const express=require("express");
const {placeOrder, getUserOrders, updateOrderstatus, getDeliveryBoyAssignment, acceptedOrder, getCurrentOrder, getOrderById, sendDeliveryOtp, verifyDeliveryOtp, verifyPayment, getTodayDeliveries} = require("../controllers/order_controller");
const auth=require("../middleware/auth_middleware");

const orderRouter=express.Router()


orderRouter.post("/place-order",auth,placeOrder)
orderRouter.get("/my-orders",auth,getUserOrders)
orderRouter.post("/update-status/:orderId/:shopId",auth,updateOrderstatus)
orderRouter.get("/get-assignments",auth,getDeliveryBoyAssignment)
orderRouter.post("/send-delivery-otp",auth,sendDeliveryOtp)
orderRouter.post("/verify-delivery-otp",auth,verifyDeliveryOtp)
orderRouter.get("/accept-order/:assignmentId",auth,acceptedOrder)
orderRouter.get("/get-currentorder",auth,getCurrentOrder)
orderRouter.get("/get-order-by-id/:orderId",auth,getOrderById)
orderRouter.post("/verify-payment",auth,verifyPayment)
orderRouter.get("/get-today-deliveries",auth,getTodayDeliveries)


module.exports=orderRouter;