import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/UserSlice'
function useGetCurrentuser() {
    const dispatch=useDispatch()
  useEffect(()=>{
    const fetchuser=async ()=>{
        try {
            const result=await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
            if(!result){
              return NULL
            }

            dispatch(setUserData(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    fetchuser()
  },[])
}
export default useGetCurrentuser
