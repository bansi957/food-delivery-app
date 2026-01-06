const mongoose=require("mongoose")

const user_schema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String
    },
    mobile:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user","owner","deliveryBoy"],
        required:true
    },
    resetOtp:{
        type:String
    },
    isOtpVerified:{
        type:Boolean,
        default:false
    },
    otpExpires:{
        type:Date
    },
    location:{
        type:{type:String,enum:['Point'],default:'Point'},
        coordinates:{type:[Number],default:[0,0]}

    }

},{
    timestamps:true
})

user_schema.index({'location':'2dsphere'})

module.exports=mongoose.model("User",user_schema)