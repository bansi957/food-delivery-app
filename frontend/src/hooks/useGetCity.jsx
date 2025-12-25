import axios from 'axios'
import React, { useEffect } from 'react'

import { useDispatch ,useSelector} from 'react-redux'
import { setCity,setState,setCurrentAdress} from '../redux/UserSlice'
function useGetCity() {
    const dispatch=useDispatch()
    const {userData}=useSelector(state=>state.user)
    const APIKEY=import.meta.env.VITE_GEOAPIKEY
  useEffect(()=>{
   navigator.geolocation.getCurrentPosition(async(position)=>{
    const {latitude,longitude}=position.coords
    try {
        const result=await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&format=json&apiKey=${APIKEY}`)
  
        dispatch(setCity(result?.data?.city))
        dispatch(setState(result?.data?.principalSubdivision))
        dispatch(setCurrentAdress((result?.data?.localityInfo?.administrative[3]?.description)||result?.data?.city))
       
    } catch (error) {
        console.log(error)
    }
  })
  },[userData])
}
export default useGetCity
