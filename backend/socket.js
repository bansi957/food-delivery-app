const User = require("./models/user");
const socketHandler = (io) => {
  io.on("connection", (socket) => {
      console.log("SOCKET CONNECTED:", socket.id);
    socket.on("identity", async ({ userId }) => {
      try {
        const user = await User.findByIdAndUpdate(
          userId,
          { socketId: socket.id, isOnline: true },
          { new: true }
        );
      } catch (error) {
        console.log(error);
      }
    });
    socket.on("update-location",async ({latitude,longitude,userId})=>{
      try {
        const user=await User.findByIdAndUpdate(userId,{
          location:{
            type:'Point',coordinates:[longitude,latitude]
          },
          isOnline:true,
          socketId:socket.id
        })
        if(user){
        io.emit('update-delivery-location',{longitude,latitude,deliveryBoyId:userId})}
      } catch (error) {
          console.log(error)
      }
    })
    socket.on("disconnect", async () => {
      try {
        await User.findOneAndUpdate(
          { socketId: socket.id },
          { isOnline: false, socketId: null },
          { new: true }
        );
      } catch (error) {
        console.log(error);
      }
    });
  });
};

module.exports = { socketHandler };
