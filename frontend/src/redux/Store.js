import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/UserSlice"
import ownerReducer from "../redux/ownerSlice"
import mapRedcuer from "../redux/mapSlice"
export const Store=configureStore({
    reducer:{
        user:userReducer,
        owner:ownerReducer,
        map:mapRedcuer
    }
})
