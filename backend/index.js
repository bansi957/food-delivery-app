require("dotenv").config()
const express=require("express");
const orderRouter=require("./routes/order_routes")
const cors=require("cors")
const database=require("./config/db");
const cookieParser = require("cookie-parser");
const authRouter=require("./routes/auth_routes");
const userRouter = require("./routes/user_routes");
const itemRouter=require("./routes/item_routes");
const {Server}=require("socket.io")
const app=express()
const http=require("http")
const server=http.createServer(app)
const io=new Server(server,{cors:{
    origin:"http://localhost:5173",
    credentials:true,
    methods:['POST','GET']
}})

app.set("io",io)
const shopRouter=require("./routes/shop_routes");
const { socketHandler } = require("./socket");
const port=process.env.PORT || 5000

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/shop",shopRouter)
app.use("/api/item",itemRouter)
app.use("/api/order",orderRouter)

socketHandler(io)
server.listen(port,()=>{
    database()
    console.log(`server is started at ${port}`);
})
