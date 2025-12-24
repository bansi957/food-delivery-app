const uploadToCloudinary = require("../utils/cloudinary");
const Item=require("../models/itemModel");
const Shop=require("../models/shopModel");
const addItem=async(req,res)=>{
    try {
        const {name,category,price,foodType}=req.body;
        let image;
        if(req.file){
            image=await uploadToCloudinary(req.file.path);

        }

        const shop=await Shop.findOne({owner:req.userId})
        if(!shop){
            return res.status(400).json({
                message:"Shop not found for the user"
            })
        }
        const item=await Item.create({
            name,
            image,
            shop:shop._id,      
            category,
            price,
            foodType                
        })

        return res.status(201).json({
            item
        })
    } catch (error) {
        return res.status(500).json({
            message:`addItem error ${error}`
        })
    }
}


const editItem=async(req,res)=>{
    try {
        const itemId=req.params.itemId;
        const {name,category,price,foodType}=req.body;
        let image;
        if(req.file){
            image=await uploadToCloudinary(req.file.path);
        }
        const shop=await Shop.findOne({owner:req.userId})
        const item=await Item.findByIdAndUpdate(itemId,{
            name,
            image,
            category,
            price,
            foodType
        },{new:true})

        if(!item){
            return res.status(404).json({
                message:"Item not found"
            })
        }
        return res.status(200).json({
            item
        })
    } catch (error) {
        
    }
    

}

module.exports={addItem,editItem}