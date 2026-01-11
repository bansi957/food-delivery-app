import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import DeliveryBoyTracking from './DeliveryBoyTracking'
import { ClipLoader } from 'react-spinners'
import { TbRuler } from 'react-icons/tb'

function DelieveryBoyDashBoard() {
  const [loading,setLoading]=useState(false)
  const [showOtp,setShowOtp]=useState(false)
  const {userData}=useSelector(state=>state.user)
  const [availableAssignments,setAvailableAssignments]=useState([])
  const [currentOrder,setCurrentOrder]=useState()
  const [otp,setOtp]=useState("")
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
    
    try {
      const result=await axios.post(`${serverUrl}/api/order/send-delivery-otp`,{orderId:currentOrder._id,shopOrderId:currentOrder.shopOrder._id},{withCredentials:true})
      console.log(result.data);
      setLoading(false)
      setShowOtp(true);
    } catch (error) {
      console.log(error)
    }
    
  }

  const handleVerifyOtp=async ()=>{
    setLoading(true)
    try {
      const result=await axios.post(`${serverUrl}/api/order/verify-delivery-otp`,{orderId:currentOrder._id,shopOrderId:currentOrder.shopOrder._id,otp},{withCredentials:true})
      console.log(result.data);
    } catch (error) {
      console.log(error)
    }
    finally{
      setLoading(false)
    }

  }


  useEffect(()=>{
      getAssignments()
      getCurrentOrder()
  },[userData])
  return (
    <div className=' w-screen  min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
      <NavBar/>
      <div className='w-full max-w-200 flex flex-col gap-5 items-center'>
        <div className=' text-center bg-white rounded-2xl  shadow-md p-5 flex flex-col justify-start items-center w-[90%] border border-orange-100 gap-2'>
          <h1 className='text-[#ff4d2d] text-xl font-bold'>Welcome, {userData.user.fullName}</h1>
          <p className='text-[#ff4d2d]'><span className='font-semibold'> Latitude: </span>{userData.user.location.coordinates[1]},<span className='font-semibold'> Longitude:</span> {userData.user.location.coordinates[0]}</p>
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
          <DeliveryBoyTracking data={currentOrder}/>
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
