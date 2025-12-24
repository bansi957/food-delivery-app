const jwt=require("jsonwebtoken")

const jwtToken=async (userId)=>{
    try {
        const token=await jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"7d"});
        return token
    } catch (error) {
        console.log(error)
    }
}

module.exports=jwtToken