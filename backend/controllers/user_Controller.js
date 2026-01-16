const User=require("../models/user")
const getCurrentUser=async (req,res)=>{
   try {
 const userId=req.userId
    if(!userId){
        return res.status(400).json({
            message:"userID not found"
        })
    }

    const user=await User.findById(userId)
    if(!user){
        return res.status(400).json({
            message:"user not found"
        })
    }

    return res.status(200).json({
            user
        })
   } catch (error) {
    return res.status(400).json({
            message:`get current user ${error}`
        })
   }
}

const updateUserLoaction=async (req,res)=>{
    try {
        const {lat,lon}=req.body
        const user=await User.findByIdAndUpdate(req.userId,{location:{
            type:'Point',
            coordinates:[lon,lat]
        }},{new:true})
        
        if(!user){
            return res.status(400).json({message:"User Not found"})
        }
        return res.status(200).json({message:"location updated"})
    } catch (error) {
         return res.status(400).json({
            message:`get current location ${error}`
        })
    }
}


module.exports={getCurrentUser,updateUserLoaction}