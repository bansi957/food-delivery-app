import React from 'react'
import { useSelector } from 'react-redux'
import UserDashBoard from '../components/UserDashBoard'
import OwnerDashBoard from '../components/OwnerDashBoard'
import DelieveryBoyDashBoard from '../components/DelieveryBoyDashBoard'

function Home() {
    const {userData}=useSelector(state=>state.user)
  return (

<div className="w-screen min-h-screen pt-24 flex flex-col items-center bg-[#fff9f6]">
  
        {userData?.user?.role==="user" && <UserDashBoard/>}
         {userData?.user?.role==="owner" && <OwnerDashBoard/>}
         {userData?.user?.role==="deliveryBoy" && <DelieveryBoyDashBoard/>}
     </div>
  )
}

export default Home
