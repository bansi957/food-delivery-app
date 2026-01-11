const Shop=require("../models/shopModel");
const uploadToCloudinary=require("../utils/cloudinary");
const creatEditShop=async(req,res)=>{
    try {
        const  {name,city,state,address}=req.body;
        let image;
        if(req.file){
            image=await uploadToCloudinary(req.file.path);
        }

        let shop=await Shop.findOne({owner:req.userId});
        if(!shop){
        shop=await Shop.create({
            name,
            image,
            owner:req.userId,
            city,
            state,
            address
        })}
        else{
            shop=await Shop.findOneAndUpdate( { _id: shop._id },{name,image,city,state,address}, {new:true});
        }    
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
            success:false,
            message:"Error in creating shop",
            error:error.message
        })
    }

}

const getMyShop=async(req,res)=>{
    try {
        const shop=await Shop.findOne({owner:req.userId}).populate("owner")
       
        if(!shop){
            return res.status(404).json({
                success:false,
                message:"Shop not found"
            })
        }
         await shop.populate({
            path:"items",
            options:{sort:{updatedAt:-1}}
        })
        return res.status(200).json({
            shop
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error in fetching shop",
            error:error.message
        })
    }
}


const getShopByCity=async (req,res)=>{
    try {
        const {city}=req.params

        const shops=await Shop.find({
            city:{$regex:new RegExp(`^${city}$` , "i")}
    }).sort({createdAt:-1})
    .populate({
            path:"items",
            options:{sort:{updatedAt:-1}}
        })
    if(!shops){
        return res.status(400).json({
            message:"Shops Not Found"
        })
    }
    return res.status(200).json(shops)
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Error in fetching shops",
            error:error.message
        })
    }
}
module.exports={creatEditShop,getMyShop,getShopByCity};