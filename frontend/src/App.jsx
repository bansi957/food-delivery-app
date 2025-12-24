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
function App() {
  useGetCurrentuser()
  useGetCity()
  const {userData}=useSelector(state=>state.user)

  return (
    <Routes>
     
      <Route path='/signin' element={!userData?<SignIn/>:<Navigate to={"/"}/>} />
       <Route path='/signup' element={!userData?<SignUp/>:<Navigate to={"/"}/>} />
      <Route path='/forgot-password' element={!userData?<ForgotPassword/>:<Navigate to={"/"}/>}/>
      <Route path="/" element={userData ? <Home/>:<Navigate to={"/signin"}/>}/>
    </Routes>
  )
}

export default App
