require("dotenv").config()
const mongoose=require("mongoose")
const Shop = require("../models/shopModel");
const Order = require("../models/orderModel");
const User=require("../models/user");
const deliveryAssignmentModel = require("../models/deliveryAssignmentModel");
const { sendDeliveryEmail } = require("../utils/mail");

const Razorpay = require("razorpay");

let instance=new Razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET,
})

// const placeOrder = async (req, res) => {
//   try {
//     const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;
//     if (cartItems.length == 0 || !cartItems) {
//       return res.status(400).json({
//         message: "cart is empty",
//       });
//     }
//     if (
//       !deliveryAddress.text ||
//       !deliveryAddress.latitude ||
//       !deliveryAddress.longitude
//     ) {
//       return res.status(400).json({
//         message: "send Complete delivery address",
//       });
//     }

//     const groupItemsByShop = {};
//     cartItems.forEach((item) => {
//       const shopId = item.shop;
//       if (!groupItemsByShop[shopId]) {
//         groupItemsByShop[shopId] = [];
//       }
//       groupItemsByShop[shopId].push(item);
//     });

//     const shopOrders = await Promise.all(
//       Object.keys(groupItemsByShop).map(async (shopId) => {
//         const shop = await Shop.findById(shopId).populate("owner");
//         if (!shop) {
//           return res.status(400).json({
//             message: "Shop not found",
//           });
//         }
//         const items = groupItemsByShop[shopId];
//         const subTotal = items.reduce(
//           (sum, i) => sum + Number(i.price) * Number(i.quantity),
//           0
//         );
//         return {
//           shop: shop._id,
//           owner: shop.owner._id,
//           subTotal,
//           shopOrderItems: items.map((i) => ({
//             item: i.id,
//             name: i.name,
//             price: i.price,
//             quantity: i.quantity,
//           })),
//         };
//       })
//     );
//     if(paymentMethod=="online"){
//        const razorOrder=await instance.orders.create({
//         amount:Math.round(totalAmount*100),
//         currency:"INR",
//         receipt:`receipt_${Date.now()}`
//       })
//       const newOrder = await Order.create({
//       user: req.userId,
//       paymentMethod,
//       deliveryAddress,
//       totalAmount,
//       shopOrders,
//       razorPayOrderId:razorOrder.id,
//       payment:false
//     })

    
//     return res.status(200).json({razorOrder,orderId:newOrder._id})
//     }
  
//     const newOrder = await Order.create({
//       user: req.userId,
//       paymentMethod,
//       deliveryAddress,
//       totalAmount,
//       shopOrders,
//     })
  

//     const populatedOrder = await Order.findById(newOrder._id)
//       .populate("user")
//       .populate("shopOrders.shop", "name")
//       .populate("shopOrders.owner", "name socketId")
//       .populate("shopOrders.shopOrderItems.item", "image");
//     const io=req.app.get('io')
//     if(io){
//       populatedOrder.shopOrders.forEach(shopOrder=>{
//         const ownerSocketId=shopOrder.owner.socketId
//         if(ownerSocketId){
//           io.to(ownerSocketId).emit("newOrder",{
//         _id:populatedOrder._id,
//         deliveryAddress:populatedOrder.deliveryAddress,
//         paymentMethod:populatedOrder.paymentMethod,
//         user:populatedOrder.user,
//         shopOrders:shopOrder,
//         createdAt:populatedOrder.createdAt,
//         payment:populatedOrder.payment
//       })
//         }
//       })
//     }

//     return res.status(200).json(populatedOrder);
//   } catch (error) {
//     return res.status(500).json({ message: `place order error ${error}` });
//   }
// };
const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "cart is empty" });
    }

    if (
      !deliveryAddress?.text ||
      !deliveryAddress?.latitude ||
      !deliveryAddress?.longitude
    ) {
      return res.status(400).json({
        message: "send complete delivery address",
      });
    }

    // ✅ Normalize shop id
    cartItems.forEach(item => {
      if (typeof item.shop === "object" && item.shop !== null) {
        item.shop = item.shop._id;
      }
      if (!mongoose.Types.ObjectId.isValid(item.shop)) {
        throw new Error("Invalid shop id in cart");
      }
    });

    // ✅ Group items by shop
    const groupItemsByShop = {};
    cartItems.forEach(item => {
      const shopId = item.shop.toString();
      if (!groupItemsByShop[shopId]) {
        groupItemsByShop[shopId] = [];
      }
      groupItemsByShop[shopId].push(item);
    });

    // ✅ Create shopOrders
    const shopOrders = await Promise.all(
      Object.keys(groupItemsByShop).map(async shopId => {
        const shop = await Shop.findById(shopId).populate("owner");
        if (!shop) {
          throw new Error("Shop not found");
        }

        const items = groupItemsByShop[shopId];
        const subTotal = items.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0
        );

        return {
          shop: shop._id,
          owner: shop.owner._id,
          subTotal,
          shopOrderItems: items.map(i => ({
            item: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        };
      })
    );

    // ✅ ONLINE PAYMENT
    if (paymentMethod === "online") {
      const razorOrder = await instance.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`
      });

      const newOrder = await Order.create({
        user: req.userId,
        paymentMethod,
        deliveryAddress,
        totalAmount,
        shopOrders,
        razorPayOrderId: razorOrder.id,
        payment: false
      });

      return res.status(200).json({
        razorOrder,
        orderId: newOrder._id
      });
    }

    // ✅ CASH ON DELIVERY
    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
      payment: false
    });

    const populatedOrder = await Order.findById(newOrder._id)
      .populate("user")
      .populate("shopOrders.shop", "name")
      .populate("shopOrders.owner", "name socketId")
      .populate("shopOrders.shopOrderItems.item", "image");

    const io = req.app.get("io");
    if (io) {
      populatedOrder.shopOrders.forEach(shopOrder => {
        const ownerSocketId = shopOrder.owner.socketId;
        if (ownerSocketId) {
          io.to(ownerSocketId).emit("newOrder", {
            _id: populatedOrder._id,
            deliveryAddress: populatedOrder.deliveryAddress,
            paymentMethod: populatedOrder.paymentMethod,
            user: populatedOrder.user,
            shopOrders: shopOrder,
            createdAt: populatedOrder.createdAt,
            payment: populatedOrder.payment
          });
        }
      });
    }

    return res.status(200).json(populatedOrder);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: `place order error ${error.message || error}`
    });
  }
};


const verifyPayment=async (req,res)=>{
  try {
    const {razorpay_payment_id,orderId}=req.body
    const payment=await instance.payments.fetch(razorpay_payment_id)
    if(!payment || payment.status!="captured" ){
       return res.status(400).json({
        message: "Payment not captured",
      });
    }
    const order=await Order.findById(orderId)
    if(!order){
       return res.status(400).json({
        message: "order not found",
      });
    }
    const populatedOrder = await Order.findById(orderId)
      .populate("user")
      .populate("shopOrders.shop", "name")
      .populate("shopOrders.owner", "name socketId")
      .populate("shopOrders.shopOrderItems.item", "image");
    const io=req.app.get('io')
    if(io){
      populatedOrder.shopOrders.forEach(shopOrder=>{
        const ownerSocketId=shopOrder.owner.socketId
        if(ownerSocketId){
          io.to(ownerSocketId).emit("newOrder",{
        _id:populatedOrder._id,
        deliveryAddress:populatedOrder.deliveryAddress,
        paymentMethod:populatedOrder.paymentMethod,
        user:populatedOrder.user,
        shopOrders:shopOrder,
        createdAt:populatedOrder.createdAt,
        payment:populatedOrder.payment
      })
        }
      })
    }
    order.payment=true;
    order.razorpayPaymentId=razorpay_payment_id
    await order.save()

      await order.populate("user")
      await order.populate("shopOrders.shop", "name")
      await order.populate("shopOrders.shopOrderItems.item", "name price image");
    return res.status(200).json(order)

  } catch (error) {
        return res.status(500).json({ message: `verify payment error${error}` });

  }
}


const getUserOrders=async (req,res)=>{
  try {
    const user=await User.findById(req.userId)
    if(user.role=="user"){
    const orders=await Order.find({user:req.userId})
    .sort({createdAt:-1})
    .populate("shopOrders.shop","name")
    .populate("shopOrders.owner","fullName email mobile")
    .populate("shopOrders.shopOrderItems.item","image")
    .populate("shopOrders.assignedDeliveryBoy")
    return res.status(200).json(orders)}

    else if(user.role=="owner"){
    const orders=await Order.find({"shopOrders.owner":req.userId})
    .sort({createdAt:-1})
    .populate("shopOrders.shop","name")
    .populate("user")
    .populate("shopOrders.shopOrderItems.item","image")
    .populate("shopOrders.assignedDeliveryBoy")
      const filteredorders=orders.map((order)=>({
        _id:order._id,
        deliveryAddress:order.deliveryAddress,
        paymentMethod:order.paymentMethod,
        user:order.user,
        shopOrders:order.shopOrders.find(o=>o.owner==req.userId),
        createdAt:order.createdAt,
        payment:order.payment
      }))
    return res.status(200).json(filteredorders)
    }
  } catch (error) {
    return res.status(500).json({message:`get user orders error ${error}`})
  }
}


const updateOrderstatus=async (req,res)=>{
  try {
    const {orderId,shopId}=req.params
    const {status}=req.body
    const order=await Order.findById(orderId)
    if (!order) {
  return res.status(404).json({ message: "Order not found" });
}
    const shopOrder=order.shopOrders.find(i=>i.shop.toString()==shopId)
    if(!shopOrder){
      return res.status(400).json({message:"Shop Order Not Found"})
    }
    shopOrder.status=status
  
    let deliveryBoysPayload = []

if (status === "out of delivery") {

  // 🟢 FIRST TIME → create assignment
  if (!shopOrder.assignment) {
    const { longitude, latitude } = order.deliveryAddress

    const nearByDeliveryBoys = await User.find({
      role: "deliveryBoy",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)]
          },
          $maxDistance: 5000
        }
      }
    })

    const nearByIds = nearByDeliveryBoys.map(b => b._id)

    const busyIds = await deliveryAssignmentModel
      .find({
        assignedTo: { $in: nearByIds },
        status: "assigned"
      })
      .distinct("assignedTo")

    const busyIdSet = new Set(busyIds.map(id => String(id)))

    const availableBoys = nearByDeliveryBoys.filter(
      d => !busyIdSet.has(String(d._id))
    )

    if (availableBoys.length === 0) {
      await order.save()
      return res.json({
        message: "order status updated but there is no delivery boys available",
        availableBoys: []
      })
    }

    const candidates = availableBoys.map(b => b._id)

    const deliveryAssignment = await deliveryAssignmentModel.create({
      order: orderId,
      shop: shopOrder.shop,
      shopOrderId: shopOrder._id,
      broadcastedTo: candidates,
      status: "broadcasted"
    })
    await deliveryAssignment.populate("order")
await deliveryAssignment.populate("shop")
    shopOrder.assignment = deliveryAssignment._id

    deliveryBoysPayload = availableBoys.map(b => ({
      id: b._id,
      name: b.fullName,
      mobile: b.mobile,
      longitude: b.location.coordinates?.[0],
      latitude: b.location.coordinates?.[1]
    }))
    const io=req.app.get('io')
    if(io){
    availableBoys.forEach(boy=>{
      const socketId=boy.socketId
      if(socketId){
        io.to(socketId).emit("new-assignment",{assignmentId:deliveryAssignment._id,
        orderId,
        shopName:deliveryAssignment.shop.name,
        deliveryAddress:deliveryAssignment.order.deliveryAddress,
        items:deliveryAssignment.order.shopOrders.find(s=>s._id.equals(deliveryAssignment.shopOrderId))?.shopOrderItems || [],
        subTotal:deliveryAssignment.order.shopOrders.find(s=>s._id.equals(deliveryAssignment.shopOrderId))?.subTotal,
        sentTo:boy._id
      
    })
    }
  })}   





  }

  // 🔵 ALREADY BROADCASTED → reuse existing assignment
  else {
  const assignment = await deliveryAssignmentModel
    .findById(shopOrder.assignment)
    .populate("broadcastedTo")

  const io = req.app.get("io")
  if (io) {
    assignment.broadcastedTo.forEach(boy => {
      if (boy.socketId) {
        io.to(boy.socketId).emit("new-assignment", {
          assignmentId: assignment._id,
          orderId,
          shopName: assignment.shop.name,
          deliveryAddress: assignment.order.deliveryAddress,
          items: order.shopOrders.find(
            s => s._id.equals(assignment.shopOrderId)
          )?.shopOrderItems || [],
          subTotal: order.shopOrders.find(
            s => s._id.equals(assignment.shopOrderId)
          )?.subTotal,
          sentTo: boy._id
        })
      }
    })
  }
}


}

  await order.save()
  const updatedShopOrder=order.shopOrders.find(i=>i.shop.toString()==shopId)

  await order.populate("shopOrders.shop","name")
  await order.populate("user")
    await order.populate("shopOrders.assignedDeliveryBoy","fullName email mobile")

const io=req.app.get('io')
if(io){
  const socketId=order.user.socketId;
  if(socketId){
    io.to(socketId).emit("update-status",{
      orderId:order._id,
      shopId,
      status,
      userId:order.user._id
    })
  }
}
    return res.status(200).json({
      shopOrder:updatedShopOrder,
      assignedDeliveryBoy:updatedShopOrder?.assignedDeliveryBoy,
      availableBoys:deliveryBoysPayload,
      assignment:updatedShopOrder?.assignment
    })
  } catch (error) {
    return res.status(500).json({message:"Order status error"})
  }
}

const getDeliveryBoyAssignment=async (req,res)=>{
    try {
      const deliveryBoyId=req.userId
      const assignments=await deliveryAssignmentModel.find({
        broadcastedTo:deliveryBoyId,
        status:"broadcasted"
      }).sort({createdAt:-1})
      .populate("order")
      .populate("shop")
      const formattedData=assignments.map(a=>({
        assignmentId:a._id,
        orderId:a.order._id,
        shopName:a.shop.name,
        deliveryAddress:a.order.deliveryAddress,
        items:a.order.shopOrders.find(s=>s._id.equals(a.shopOrderId))?.shopOrderItems || [],
        subTotal:a.order.shopOrders.find(s=>s._id.equals(a.shopOrderId))?.subTotal
      }))

      return res.status(200).json(formattedData)
    } catch (error) {
       return res.status(500).json({message: `get Assignment error ${error}`})
    }
}

const acceptedOrder=async (req,res)=>{
  try {
    const {assignmentId}=req.params
    const assignment=await deliveryAssignmentModel.findById(assignmentId)
    if(!assignment){
      return res.status(400).json({message:"assignment not found"})
    }
    if(assignment.status!=="broadcasted"){
        return res.status(400).json({message:"assignment is expired"})
    }
    const alreadyAssigned=await deliveryAssignmentModel.findOne({assignedTo:req.userId,status:{$nin:["broadcasted","completed"]}})
    if(alreadyAssigned){
              return res.status(400).json({message:"You are already assigned to another order"})
    }
    assignment.assignedTo=req.userId
    assignment.status="assigned"
    assignment.acceptedAt=new Date()
    await assignment.save()
    const order=await Order.findById(assignment.order)
    if(!order){
     return res.status(400).json({message:"order not found"})

    }
const shopOrder = order.shopOrders.find(s =>
  s._id.equals(assignment.shopOrderId)
)
    shopOrder.assignedDeliveryBoy=req.userId
    await order.save()

    return res.status(200).json({
        message:"order accepted"
    })
  } catch (error) {
    return res.status(500).json({
      message:`accept order error ${error}`
    })
  }
}

const getCurrentOrder=async (req,res)=>{
  try {
    const assignment=await deliveryAssignmentModel.findOne({assignedTo:req.userId,status:"assigned"})
    .populate("shop","name")
    .populate("assignedTo","fullName email mobile location")
    .populate({path:"order",
      populate:[{path:"user",select:"fullName email location mobile"}]
    })
    if(!assignment){
      return res.status(400).json({message:"assignment not found"})
    }
    if(!assignment.order){
            return res.status(400).json({message:"order not found"})
    }
    const shopOrder=assignment.order.shopOrders.find(s=>s._id.equals(assignment.shopOrderId))
   

    if(!shopOrder){
                  return res.status(400).json({message:"shopOrder not found"})

    }
    let deliveryBoyLocation={lat:null,lon:null}
    
    deliveryBoyLocation.lat=assignment.assignedTo.location.coordinates[1]
    deliveryBoyLocation.lon=assignment.assignedTo.location.coordinates[0]

    let customerLocation={lat:null,lon:null}
    if(assignment.order.deliveryAddress){
    customerLocation.lat=assignment.order.deliveryAddress.latitude
    customerLocation.lon=assignment.order.deliveryAddress.longitude}

    return res.status(200).json({
      _id:assignment.order._id,
      user:assignment.order.user,
      assignment,
      shopOrder,
      deliveryAddress:assignment.order.deliveryAddress,
      deliveryBoyLocation,
      customerLocation

    })
  } catch (error) {
    return res.status(500).json({
      message:`current order error ${error}`
    })
  }
}

const getOrderById=async (req,res)=>{
  try {
    const {orderId}=req.params;

    const order=await Order.findById(orderId)
    .populate("user")
    .populate({path:"shopOrders.shop",model:"Shop"})
    .populate({path:"shopOrders.assignedDeliveryBoy",model:"User"})
    .populate({path:"shopOrders.shopOrderItems.item",model:"Item"})
    .lean()
    if(!order){
      res.status(400).json({message:"order not found"})
    }
    return res.status(200).json(order)
  } catch (error) {
     return res.status(500).json({
      message:`get by orderid error ${error}`
    })
  }
}

const sendDeliveryOtp=async (req,res)=>{
  try {
    const {orderId,shopOrderId}=req.body
    const order=await Order.findById(orderId).populate("user")
    const shopOrder=order.shopOrders.id(shopOrderId)
    if(!order || !shopOrder){
      return res.status(400).json({message:"order or shopOrder not found"})
    }
    const otp=Math.floor(100000 + Math.random() * 900000).toString();
    shopOrder.deliveryOtp=otp
    shopOrder.otpExpires=Date.now()+5*60*1000
    await order.save();
    await sendDeliveryEmail({to:order.user.email,otp,sub:"Your OTP for Delivery"})
    return res.status(200).json({message:`Otp sent successfully to ${order.user.fullName}`})
  } catch (error) {
     return res.status(500).json({
      message:`delivery otp send error ${error}`
    })
  }
}

const verifyDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId, otp } = req.body;

    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return res.status(400).json({ message: "order not found" });
    }

    const shopOrder = order.shopOrders.id(shopOrderId);
    if (!shopOrder) {
      return res.status(400).json({ message: "shopOrder not found" });
    }

    if (
      shopOrder.deliveryOtp !== otp ||
      shopOrder.otpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "invalid/Expired OTP" });
    }

    shopOrder.status = "delivered";
    shopOrder.deliveredAt = new Date(); // ✅ UTC-safe
    shopOrder.deliveryOtp = null;
    shopOrder.otpExpires = null;

    await order.save();

    const ass = await deliveryAssignmentModel.findOne({
      shopOrderId,
      order: orderId
    });

    await deliveryAssignmentModel.deleteOne({
      shopOrderId,
      order: orderId
    });

    return res.status(200).json({
      message: "order delivered successfully",
      assignmentId: ass?._id
    });

  } catch (error) {
    return res.status(500).json({
      message: `delivery otp verification error ${error.message}`
    });
  }
};

/* ================= GET TODAY DELIVERIES (IST) ================= */

const getTodayDeliveries = async (req, res) => {
  try {
    const dId = new mongoose.Types.ObjectId(req.userId);

    // ✅ Proper IST midnight calculation
    const now = new Date();
    const istNow = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    istNow.setHours(0, 0, 0, 0);
    const startOfDay = new Date(istNow.getTime());

    const orders = await Order.find({
      shopOrders: {
        $elemMatch: {
          assignedDeliveryBoy: dId,
          status: "delivered",
          deliveredAt: { $gte: startOfDay }
        }
      }
    }).lean();

    const stats = {};

    orders.forEach(order => {
      order.shopOrders.forEach(shopOrder => {
        if (
          shopOrder.status === "delivered" &&
          shopOrder.deliveredAt &&
          shopOrder.assignedDeliveryBoy?.toString() === dId.toString() &&
          shopOrder.deliveredAt >= startOfDay
        ) {
          // ✅ IST hour
          const hour = Number(
            new Date(shopOrder.deliveredAt).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
              hour: "2-digit",
              hour12: false
            })
          );

          stats[hour] = (stats[hour] || 0) + 1;
        }
      });
    });

    const formattedStats = Object.entries(stats)
      .map(([hour, count]) => ({
        hour: Number(hour),
        count
      }))
      .sort((a, b) => a.hour - b.hour);

    return res.status(200).json(formattedStats);

  } catch (error) {
    return res.status(500).json({
      message: `get today deliveries error ${error.message}`
    });
  }
};


module.exports = {getTodayDeliveries,verifyPayment,sendDeliveryOtp,verifyDeliveryOtp,getOrderById,getCurrentOrder,acceptedOrder,placeOrder,getUserOrders,updateOrderstatus,getDeliveryBoyAssignment};
