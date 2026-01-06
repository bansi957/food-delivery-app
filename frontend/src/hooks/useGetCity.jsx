import axios from "axios";
import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setCity, setState, setCurrentAdress } from "../redux/UserSlice";
import { setAddress, setLocation } from "../redux/mapSlice";
function useGetCity() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const APIKEY = import.meta.env.VITE_GEOAPIKEY;
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      dispatch(setLocation({ lat: latitude, lon: longitude }));
      try {
        const result = await axios.get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${APIKEY}`
        );

        const location = result?.data?.results?.[0];
    
        dispatch(setCity(location?.city || location?.county ||""));
        dispatch(setState(location?.state || ""));
        dispatch(setCurrentAdress(location?.formatted || ""));
        dispatch(setAddress(location?.formatted || ""));
      } catch (error) {
        console.log(error);
      }
    });
  }, [userData]);
}
export default useGetCity;
