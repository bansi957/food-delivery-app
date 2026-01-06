import React from 'react'
import {useSelector} from 'react-redux'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import UserMyOrdersCard from '../components/UserMyOrdersCard';
import OwnerMyOrdersCard from '../components/OwnerMyOrdersCard'
function MyOrders() {
  const {userData,myorders}=useSelector(state=>state.user) 
  const navigate=useNavigate()

  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex justify-center px-4'>
      <div className='w-full max-w-200 p-4'>
          <div className="flex items-center gap-5 mb-6">
                    <div className=" z-10">
                      <IoIosArrowRoundBack
                        size={35}
                        className="text-[#ff4d2d] cursor-pointer"
                        onClick={() => navigate("/")}
                      />
                    </div>
                    <h1 className="text-2xl font-bold text-start">{userData?.user?.role==="user"||userData?.user?.role==="deliveryBoy" ?"My Orders": "Pending Orders"}</h1>
                  </div>
          <div className='space-y-10'>
              {myorders?.map((order,ind)=>(
                userData?.user?.role==="user" ?
                ( 
                  <UserMyOrdersCard data={order} key={ind}/>
                ):
                userData?.user?.role==="owner"?
                (
                  <OwnerMyOrdersCard data={order} key={ind}/>
                ):null
                              ))}
          </div>
      </div>
    </div>
  )
}

export default MyOrders
