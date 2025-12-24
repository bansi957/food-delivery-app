import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/UserSlice"
import ownerReducer from "../redux/ownerSlice"
export const Store=configureStore({
    reducer:{
        user:userReducer,
        owner:ownerReducer
    }
})
