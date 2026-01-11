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
        shop.items.push(item._id)
        await shop.save()
        await shop.populate("owner")
        await shop.populate({
            path:"items",
            options:{sort:{updatedAt:-1}}
        })

        return res.status(201).json({
            shop
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
        let shop=await Shop.findOne({owner:req.userId})
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
        await shop.populate("owner")
        await shop.populate({
            path:"items",
            options:{sort:{updatedAt:-1}}
        })

        return res.status(200).json({
            shop
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:`editItem error ${error}`
        })
    }
    

}

const getItemById=async(req,res)=>{
    try {
        const itemId=req.params.itemId;
        const item=await Item.findById(itemId);
        if(!item){
            return res.status(404).json({
                message:"Item not found"
            })
        }
        return res.status(200).json({
            item
        })
    } catch (error) {
        res.status(500).json({
            message:`getItemById error ${error}`
        })
    }
}

const deleteItemById=async (req,res)=>{
    try {
        const itemId=req.params.itemId
        const item=await Item.findByIdAndDelete(itemId)
        if(!item){
            return res.status(400).json({
                message:"shop not found"
            })
        }
         const shop=await Shop.findOne({owner:req.userId})
         shop.items=shop.items.filter(i=>i.toString()!==itemId)
         await shop.save()

        await shop.populate("owner")
        await shop.populate({
            path:"items",
            options:{sort:{updatedAt:-1}}
        })
        res.status(200).json({
            shop        
        })
    } catch (error) {
         res.status(500).json({
            message:`getItemById error ${error}`
        })
    }
}

const getItemsByShopId=async (req,res)=>{
    try {
        const {shopId}=req.params
        const shop=await Shop.findById(shopId)
        .populate("items")
        if(!shop){
            return res.status(400).json({message:"shop not found"})
        }
        res.status(200).json({shop,items:shop.items})
    } catch (error) {
         res.status(500).json({
            message:`get shop by id error ${error}`
        })
    }
}
module.exports={getItemsByShopId,addItem,editItem,getItemById,deleteItemById};