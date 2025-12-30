import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setShopsInMyCity} from '../redux/UserSlice'

function useGetShopByCity() {
    const dispatch=useDispatch()
    const {city}=useSelector(state=>state.user)
  useEffect(()=>{
    const fetCity=async ()=>{
        try {
            const result=await axios.get(`${serverUrl}/api/shop/get-by-city/${city}`,{withCredentials:true})
            if(!result){
              return NULL
            }

            dispatch(setShopsInMyCity(result.data))
        } catch (error) {
            console.log(error)
        }
    }

    fetCity()
  },[city])
}
export default useGetShopByCity
