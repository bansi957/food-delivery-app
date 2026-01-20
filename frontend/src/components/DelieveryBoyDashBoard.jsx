  import React, { useEffect, useState } from 'react'
  import Navbar from './Navbar'
  import { useSelector } from 'react-redux'
  import axios from 'axios'
  import { serverUrl } from '../App'
  import DeliveryBoyTracking from './DeliveryBoyTracking'
  import { ClipLoader } from 'react-spinners'
  import { getSocket } from '../../socket'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

  function DelieveryBoyDashBoard() {
    const [loading,setLoading]=useState(false)
    const [message,setMessage]=useState("")
    const [showOtp,setShowOtp]=useState(false)
    const {userData}=useSelector(state=>state.user)
    const [availableAssignments,setAvailableAssignments]=useState([])
    const [currentOrder,setCurrentOrder]=useState()
    const [otp,setOtp]=useState("")
    const [todayDeliveries,setTodayDeliveries]=useState([])
    const handleTodayDeliveries=async()=>{
      try {
        const result=await axios.get(`${serverUrl}/api/order/get-today-deliveries`,{withCredentials:true})
        console.log(result.data)
        setTodayDeliveries(result.data)
      } catch (error) {
        console.log(error)
      }
    }

    const getAssignments=async()=>{
      try {
        const result=await axios.get(`${serverUrl}/api/order/get-assignments`,{withCredentials:true})
        setAvailableAssignments(result.data)
      } catch (error) {
        console.log(error)
      }
    }
    const acceptOrder=async (assignmentId)=>{
      try {
        const result=await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`,{withCredentials:true})
        await getCurrentOrder()
      } catch (error) {
        console.log(error)
      }
    }
    const getCurrentOrder=async ()=>{
      try {
        const result=await axios.get(`${serverUrl}/api/order/get-currentorder`,{withCredentials:true})

        setCurrentOrder(result.data)
      } catch (error) {
        console.log(error)
      }
    }

    const handleSendOtp=async ()=>{
      setLoading(true)
      setMessage("")
      
      try {
        const result=await axios.post(`${serverUrl}/api/order/send-delivery-otp`,{orderId:currentOrder._id,shopOrderId:currentOrder.shopOrder._id},{withCredentials:true})
        
        setLoading(false)
        setShowOtp(true);
      } catch (error) {
        console.log(error)
      }
      
    }

    const handleVerifyOtp=async ()=>{
      setLoading(true)
      setMessage("")
      setOtp("")
      try {
        const result=await axios.post(`${serverUrl}/api/order/verify-delivery-otp`,{orderId:currentOrder._id,shopOrderId:currentOrder.shopOrder._id,otp},{withCredentials:true})
        setMessage(result.data.message)
        handleTodayDeliveries()
        const filteredAssignments=availableAssignments?.filter(a=>a.assignmentId!=result.data.assignmentId)
        setAvailableAssignments(filteredAssignments||[])
       setShowOtp(false)
       setOtp("")
        setCurrentOrder(null)
        
        
      } catch (error) {
        console.log(error)
        setMessage(error.response?.data?.message || "Something went wrong")
      }
      finally{
        setLoading(false)
      }

    }
    

      const ratePerDelivery=50
      const totalEarning= todayDeliveries.reduce((sum,delivery)=>(sum+delivery.count*ratePerDelivery),0)
  

  useEffect(()=>{
  
      const socket=getSocket()

        socket.on('new-assignment',(data)=>{
          if(data.sentTo==userData.user._id){
          setAvailableAssignments(prev=>[...prev,data])
        }})

      return()=>{socket.off("new-assignment")}
    
  },[userData?.user?._id])
    useEffect(()=>{
        getAssignments()
        getCurrentOrder()
        handleTodayDeliveries()
    },[userData])

    const socket=getSocket()
    const [dlocation,setDlocation]=useState(null)
    
    useEffect(()=>{
      if(!socket || userData.user.role!=="deliveryBoy"){
        return;
      }
      let watchId;
      if(navigator.geolocation){
        watchId=navigator.geolocation.watchPosition((position)=>{
          const latitude=position.coords.latitude;
          const longitude=position.coords.longitude; 
          setDlocation({lat:latitude,lon:longitude})
          socket.emit("update-location",{latitude,longitude,userId:userData.user._id})
        },
        (error)=>{console.log(error)},
      {enableHighAccuracy:true})
      }

      return()=>{
        if(watchId){
          navigator.geolocation.clearWatch(watchId)
        }
      }
    },[socket,userData])


    return (
      <div className=' w-screen  min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
        <Navbar/>
        <div className='w-full max-w-200 flex flex-col gap-5 items-center'>
          <div className=' text-center bg-white rounded-2xl  shadow-md p-5 flex flex-col justify-start items-center w-[90%] border border-orange-100 gap-2'>
            <h1 className='text-[#ff4d2d] text-xl font-bold'>Welcome, {userData.user.fullName}</h1>
            <p className='text-[#ff4d2d]'><span className='font-semibold'> Latitude: </span>{dlocation?.lat||userData.user.location.coordinates[1]},<span className='font-semibold'> Longitude:</span> {dlocation?.lon||userData.user.location.coordinates[1]}</p>
          </div>

          <div className='bg-white rounded-2xl shadow-md p-5 w-[90%] mb-6 border border-orange-100'>
            <h1 className='text-lg font-bold mb-3 text-[#ff4d2d]'>Today Deliveries</h1>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={todayDeliveries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tickFormatter={(h)=>`${h}:00`} />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value) => [value,"orders"]} labelFormatter={label=>`${label}:00`}/>
                <Legend />
                <Bar dataKey="count" fill="#ff4d2d" />
              </BarChart>
            </ResponsiveContainer>
              <div className='max-w-sm mx-auto mt-6 p-6 bg-white rounded-2xl shadow-lg text-center'>
                <h1 className='text-xl font-semi-bold text-gray-800'>Today's Earning</h1>
                <span className='text-3xl font-bold text-green-600'>₹{totalEarning}</span>
              </div>
          </div>


          {!currentOrder && <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100'>
            <h1 className='text-lg font-bold mb-4 flex items-center gap-2'>Available Orders</h1>
            <div className='space-y-4'>
              {availableAssignments.length==0
              ?<p className='text-gray-400 text-sm'>No Available Orders</p>
              :(availableAssignments.map((a,ind)=>(
                <div className="border rounded-lg p-4 flex justify-between items-center" key={ind}>
                  <div>
                    <p className='text-sm font-semibold'>{a.shopName}</p>
                    <p className='text-sm text-gray-400'><span className='font-semibold'>Delivery Address: </span>{a.deliveryAddress.text}</p>
                    <p className='text-sm text-gray-400'>{a.items.length} items | ₹{a.subTotal}</p>
                  </div>
                  <button className='bg-orange-500 text-white rounded-lg py-1 px-4 text-sm hover:bg-orange-600' onClick={()=>acceptOrder(a.assignmentId)}>Accept</button>
                </div>
              )))}
            </div>
          </div>}

          {currentOrder && <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100'>
            <h2 className='text-lg font-bold mb-3'>📦Current Order</h2>
            <div className='border rounded-lg p-4 mb-3'>
              <p className='font-semibold text-sm'>{currentOrder.assignment.shop.name}</p>
              <p className='text-sm text-gray-500'>{currentOrder.deliveryAddress.text}</p>
              <p className='text-sm text-gray-400'> {currentOrder.shopOrder.shopOrderItems.length} items | ₹{currentOrder.shopOrder.subTotal}</p>

            </div>
            <DeliveryBoyTracking data={{

                    deliveryBoyLocation:dlocation||{lat:userData.user.location.coordinates[1],lon:userData.user.location.coordinates[0]},
                    customerLocation: {
                      lat: currentOrder.deliveryAddress.latitude,
                      lon: currentOrder.deliveryAddress.longitude,
                    }
                  }}/>
            {!showOtp ?<button disabled={loading} onClick={handleSendOtp} className='mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200'>{loading? <ClipLoader size={20} color='white'/> :"Mark As Delivered"}</button> :
            <div className='mt-4 p-4 border rounded-xl bg-gray-50'> 
            <p className='text-sm font-semibold mb-2 '> Enter Otp Send  to <span className='text-orange-500'> {currentOrder.user.fullName} </span></p>
            <input
            type='text'
            value={otp}
            onChange={(e)=>setOtp(e.target.value)}
            placeholder='Enter OTP'
            className='w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400' 
            />
            {message && <p className=' text-center font-bold mb-2  text-green-400'>{message}</p>}
          <button disabled={loading} onClick={handleVerifyOtp} className='w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all'>{loading? <ClipLoader size={20} color='white'/> :"Submit OTP"}</button>
            </div>
  }     
            </div>
            
  }
        </div> 
      </div>
    )
  }

  export default DelieveryBoyDashBoard
