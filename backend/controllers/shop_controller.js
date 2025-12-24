const Shop=require("../models/shopModel");
const uploadToCloudinary=require("../utils/cloudinary");
const creatEditShop=async(req,res)=>{
    try {
        const  {name,city,state,address}=req.body;
        console.log(req.body)
        console.log(req.file)
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
        await shop.populate("owner");
        return res.status(201).jscon({
            success:true,
            message:"Shop created successfully",
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



module.exports={creatEditShop};