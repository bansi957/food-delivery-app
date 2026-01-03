const express=require("express");
const placeOrder = require("../controllers/order_controller");
const auth=require("../middleware/auth_middleware")

const orderRouter=express.Router()


orderRouter.post("/place-order",auth,placeOrder)

module.exports=orderRouter;