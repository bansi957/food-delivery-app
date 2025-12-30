const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },

  category: {
    type: String,
    enum: [
      "Snacks",
      "Main Course",
      "Beverages",
      "Desserts",
      "Pizza",
      "Burgers",
      "Salads",
      "Soups",
      "Sandwiches",
      "Northern Indian",
      "South Indian",
      "Chinese",
      "Fast Food",
      "Others",
    ],
    required: true,
  },


  price: {
    type: Number,
    min: 0,
    required: true,
  },

  foodType: {
    type: String,
    enum: ["Veg", "Non-Veg"],
    required: true,
  },

  rating:{
    average:{type:Number,default:0},
    count:{type:Number,default:0}

  }
}, { timestamps: true });
module.exports = mongoose.model("Item", itemSchema);
