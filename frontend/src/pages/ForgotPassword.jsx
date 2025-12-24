import axios from 'axios';
import React, { useState } from 'react'
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import {serverUrl} from '../App'
import { ClipLoader } from 'react-spinners';
function ForgotPassword() {
    const [step,setStep]=useState(1);
    const [email,setEmail]=useState("")
    const [otp,setOtp]=useState("")
    const [newpass,setNewpass]=useState("")
    const [confirmpass,setConfirmpass]=useState("")
    const navigate=useNavigate()
    const [loadingOtp,setLoadingOtp]=useState(false)
    const [err,setError]=useState("")
    const handleOtpSend=async ()=>{
      try {
        setLoadingOtp(true)
        const result=await axios.post(`${serverUrl}/api/auth/send-otp`,{email},{withCredentials:true})
        console.log(result)
        setError("")
        setStep(2)
      } catch (error) {
        setError(error.response.data.message)
      }
      finally {
      setLoadingOtp(false);
    }
    }
    

    const handleOtpValid=async ()=>{
      if(!otp){
        alert("please enter the otp first")
      }
      try {
        setLoadingOtp(true)
        const result=await axios.post(`${serverUrl}/api/auth/verify-otp`,{email,otp},{withCredentials:true})
        console.log(result)
        setError("")
        setStep(3)
      } catch (error) {
         setError(error.response.data.message)
      }
      finally{
        setLoadingOtp(false)
      }
    }

    const handleResetPassword=async ()=>{
      if(newpass!==confirmpass){
        setError("new password and copnfirm password must be same")
        return null
      }
      try {
        setLoadingOtp(true)
        const result=await axios.post(`${serverUrl}/api/auth/change-password`,{email,newpass},{withCredentials:true})
        console.log(result)
        setError("")
        navigate("/signin")
      } catch (error) {
        setError(error.response.data.message)
      }
      finally{
        setLoadingOtp(false)
      }
    }
  return (
    <div className='w-full flex items-center justify-center min-h-screen p-4 bg-[#fff9f6]'>
      <div className='w-full max-w-md bg-white p-8 rounded-xl shadow-xl '>

        <div className='flex items-center gap-4 mb-6'>
            <IoArrowBackSharp size={30} className='cursor-pointer text-[#ff4d2d]' onClick={()=>navigate("/signin")}/>
            <h1 className='text-2xl font-bold text-center text-[#ff4d2d]'>
                Forgot Password
            </h1>
        </div>
        {step==1 &&
         <div>
            <div>
            <label className="text-sm font-medium">Email</label>
            <div className="flex gap-2 mt-1">
              <input
                type="email"
                name="email"  
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="Enter your Email"
                className="flex-1 px-4 mb-4  py-2 rounded-lg border[1px] focus:outline-none border-gray-200 outline-none"
                required
    
              />
            
            </div>
          
          </div>
           <button
           onClick={handleOtpSend}
           disabled={loadingOtp}
            type="button"
            className="w-full py-3 rounded-lg text-white font-semibold cursor-pointer bg-[#ff4d2d]" >
            {loadingOtp ? <ClipLoader size={20} color='white'/> : "Send OTP"}
          </button>
                    {err && <p className="text-red-500 text-center my-[10]"> *{err}</p>}

          </div>}

          {step==2 &&
           <div>
            <div>
            <label className="text-sm font-medium">OTP</label>
            <div className="flex gap-2 mt-1">
              <input
                type="email"
                name="email"  
                value={otp}
                onChange={(e)=>setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="flex-1 px-4 mb-4  py-2 rounded-lg border[1px] focus:outline-none border-gray-200 outline-none"
                required
    
              />
            
            </div>
          
          </div>
           <button
           onClick={handleOtpValid}
            type="button"
            disabled={loadingOtp}
            className="w-full py-3 rounded-lg text-white font-semibold cursor-pointer bg-[#ff4d2d]" >
            {loadingOtp ? <ClipLoader size={20} color='white'/> : "Verify"}
          </button>
                    {err && <p className="text-red-500 text-center my-[10]"> *{err}</p>}

          </div>
            }

            {step==3 &&
             <div>
            <div>
            <label className="text-sm font-medium">New Password</label>
            <div className="flex gap-2 mt-1">
              <input
                type="email"
                name="email"  
                value={newpass}
                onChange={(e)=>setNewpass(e.target.value)}
                placeholder="Enter New Password"
                className="flex-1 px-4 mb-4  py-2 rounded-lg border[1px] focus:outline-none border-gray-200 outline-none"
                required
              />
            
            </div>
          
          </div>

            <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="flex gap-2 mt-1">
              <input
                type="email"
                name="email"  
                value={confirmpass}
                onChange={(e)=>setConfirmpass(e.target.value)}
                placeholder="Confirm password"
                className="flex-1 px-4 mb-4  py-2 rounded-lg border[1px] focus:outline-none border-gray-200 outline-none"

              required
              />
            
            </div>
          
          </div>
           <button
           onClick={handleResetPassword}
            type="button"
            disabled={loadingOtp}
            className="w-full py-3 rounded-lg text-white font-semibold cursor-pointer bg-[#ff4d2d]" >
             {loadingOtp ?<ClipLoader size={20} color='white'/> : "Reset Password"}
          </button>
                    {err && <p className="text-red-500 text-center my-[10]"> *{err}</p>}

          </div>}
      </div>
    </div>
  )
}

export default ForgotPassword
