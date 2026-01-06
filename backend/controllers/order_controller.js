const Shop = require("../models/shopModel");
const Order = require("../models/orderModel");
const User=require("../models/user");
const deliveryAssignmentModel = require("../models/deliveryAssignmentModel");
const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;
    if (cartItems.length == 0 || !cartItems) {
      return res.status(400).json({
        message: "cart is empty",
      });
    }
    if (
      !deliveryAddress.text ||
      !deliveryAddress.latitude ||
      !deliveryAddress.longitude
    ) {
      return res.status(400).json({
        message: "send Complete delivery address",
      });
    }

    const groupItemsByShop = {};
    cartItems.forEach((item) => {
      const shopId = item.shop;
      if (!groupItemsByShop[shopId]) {
        groupItemsByShop[shopId] = [];
      }
      groupItemsByShop[shopId].push(item);
    });

    const shopOrders = await Promise.all(
      Object.keys(groupItemsByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");
        if (!shop) {
          return res.status(400).json({
            message: "Shop not found",
          });
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
          shopOrderItems: items.map((i) => ({
            item: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        };
      })
    );

    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
    })
    

    const populatedOrder = await Order.findById(newOrder._id)
      .populate("user")
      .populate("shopOrders.shop", "name")
      .populate("shopOrders.shopOrderItems.item", "image");

    return res.status(200).json(populatedOrder);
  } catch (error) {
    return res.status(500).json({ message: `place order error ${error}` });
  }
};

const getUserOrders=async (req,res)=>{
  try {
    const user=await User.findById(req.userId)
    if(user.role=="user"){
    const orders=await Order.find({user:req.userId})
    .sort({createdAt:-1})
    .populate("shopOrders.shop","name")
    .populate("shopOrders.owner","fullName email mobile")
    .populate("shopOrders.shopOrderItems.item","image")

    return res.status(200).json(orders)}

    else if(user.role=="owner"){
    const orders=await Order.find({"shopOrders.owner":req.userId})
    .sort({createdAt:-1})
    .populate("shopOrders.shop","name")
    .populate("user")
    .populate("shopOrders.shopOrderItems.item","image")
      const filteredorders=orders.map((order)=>({
        _id:order._id,
        deliveryAddress:order.deliveryAddress,
        paymentMethod:order.paymentMethod,
        user:order.user,
        shopOrders:order.shopOrders.find(o=>o.owner==req.userId),
        createdAt:order.createdAt
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

    shopOrder.assignment = deliveryAssignment._id

    deliveryBoysPayload = availableBoys.map(b => ({
      id: b._id,
      name: b.fullName,
      mobile: b.mobile,
      longitude: b.location.coordinates?.[0],
      latitude: b.location.coordinates?.[1]
    }))
  }

  // 🔵 ALREADY BROADCASTED → reuse existing assignment
  else {
    const assignment = await deliveryAssignmentModel
      .findById(shopOrder.assignment)
      .populate("broadcastedTo", "fullName mobile location")

    deliveryBoysPayload = assignment.broadcastedTo.map(b => ({
      id: b._id,
      name: b.fullName,
      mobile: b.mobile,
      longitude: b.location.coordinates?.[0],
      latitude: b.location.coordinates?.[1]
    }))
  }
}

  await order.save()
  const updatedShopOrder=order.shopOrders.find(i=>i.shop.toString()==shopId)

  await order.populate("shopOrders.shop","name")
    await order.populate("shopOrders.assignedDeliveryBoy","fullName email mobile")

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




module.exports = {placeOrder,getUserOrders,updateOrderstatus,getDeliveryBoyAssignment};
