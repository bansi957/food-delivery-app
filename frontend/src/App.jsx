import React, { use } from 'react'
export const serverUrl="http://localhost:8000"
import {Routes,Route,Navigate} from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/forgotPassword'
import useGetCurrentuser from './hooks/useGetCurrentuser'
import { useSelector } from 'react-redux'
import useGetCity from './hooks/useGetCity'
import Home from './pages/Home'
import useGetMyShop from './hooks/useGetMyShop'
import CreateEditShop from './pages/createEditShop'
import AddItems from './pages/AddItems'
import EditItem from './pages/EditItem'
function App() {
  useGetCurrentuser()
  useGetCity()
  useGetMyShop()
  const {userData}=useSelector(state=>state.user)

  return (
    <Routes>
     
      <Route path='/signin' element={!userData?<SignIn/>:<Navigate to={"/"}/>} />
       <Route path='/signup' element={!userData?<SignUp/>:<Navigate to={"/"}/>} />
      <Route path='/forgot-password' element={!userData?<ForgotPassword/>:<Navigate to={"/"}/>}/>
      <Route path="/" element={userData ? <Home/>:<Navigate to={"/signin"}/>}/>
      <Route path="/create-edit-shop" element={userData?.user?.role==="owner" ? <CreateEditShop/>:<Navigate to={"/"}/>}/>
      <Route path="/add-food" element={userData?.user?.role==="owner" ? <AddItems/>:<Navigate to={"/"}/>}/>
      <Route path="/edit-food/:id" element={userData?.user?.role==="owner" ? <EditItem/>:<Navigate to={"/"}/>}/>

    </Routes>
  )
}

export default App
