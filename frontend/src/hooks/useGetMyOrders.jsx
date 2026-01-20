import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setMyOrders } from '../redux/UserSlice'
function useGetMyOrders() {
    const dispatch=useDispatch()
    const {userData}=useSelector(state=>state.user)
  useEffect(()=>{
    const fetchOrders=async ()=>{
        try {
            const result=await axios.get(`${serverUrl}/api/order/my-orders`,{withCredentials:true})
            if(!result){
              return null
            }
     
            dispatch(setMyOrders(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    fetchOrders()
  },[userData?.user?._id])
}
export default useGetMyOrders
