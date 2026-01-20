import React, { use } from 'react'
export const serverUrl="https://zwiggy-backend-tqab.onrender.com"
import {Routes,Route,Navigate} from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentuser from './hooks/useGetCurrentuser'
import { useDispatch, useSelector } from 'react-redux'
import useGetCity from './hooks/useGetCity'
import Home from './pages/Home'
import useGetMyShop from './hooks/useGetMyShop'
import CreateEditShop from './pages/CreateEditShop'
import AddItems from './pages/AddItems'
import EditItem from './pages/EditItem'
import useGetShopByCity from './hooks/useGetShopByCity'
import CartPage from './pages/CartPage'
import CheckOut from './pages/CheckOut'
import OrderPlaced from './pages/OrderPlaced'
import MyOrders from './pages/MyOrders'
import useGetMyOrders from './hooks/useGetMyOrders'
import useUpdateLocation from './hooks/useUpdateLocation'
import TrackOrder from './pages/TrackOrder'
import Shop from './pages/Shop'
import { useEffect } from 'react'
import { getSocket } from '../socket'

function App() {
  useGetCurrentuser()
  useGetShopByCity();
  useGetCity()
  useGetMyShop()
  useGetMyOrders()
  useUpdateLocation()
  const {userData}=useSelector(state=>state.user)
  
 useEffect(() => {
  if (!userData?.user?._id) return

  const socket = getSocket()

  socket.emit("identity", { userId: userData.user._id })

}, [userData?.user?._id])

  return (
    <Routes>
     
      <Route path='/signin' element={!userData?<SignIn/>:<Navigate to={"/"}/>} />
       <Route path='/signup' element={!userData?<SignUp/>:<Navigate to={"/"}/>} />
      <Route path='/forgot-password' element={!userData?<ForgotPassword/>:<Navigate to={"/"}/>}/>
      <Route path="/" element={userData ? <Home/>:<Navigate to={"/signin"}/>}/>
      <Route path="/create-edit-shop" element={userData?.user?.role==="owner" ? <CreateEditShop/>:<Navigate to={"/"}/>}/>
      <Route path="/add-food" element={userData?.user?.role==="owner" ? <AddItems/>:<Navigate to={"/"}/>}/>
      <Route path="/edit-food/:id" element={userData?.user?.role==="owner" ? <EditItem/>:<Navigate to={"/"}/>}/>
    <Route path="/cart" element={userData?.user?.role==="user" ? <CartPage/>:<Navigate to={"/"}/>}/>
    <Route path="/checkout" element={userData?.user?.role==="user" ? <CheckOut/>:<Navigate to={"/"}/>}/>
    <Route path="/orderplaced" element={userData?.user?.role==="user" ? <OrderPlaced/>:<Navigate to={"/"}/>}/>
    <Route path="/my-orders" element={userData? <MyOrders/>:<Navigate to={"/"}/>}/>
    <Route path="/track-order/:orderId" element={userData?.user?.role=="user"? <TrackOrder/>:<Navigate to={"/"}/>}/>
    <Route path="/shop/:shopId" element={userData?.user?.role=="user"? <Shop/>:<Navigate to={"/"}/>}/>



    </Routes>
  )
}

export default App
