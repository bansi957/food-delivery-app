import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/UserSlice"
export const Store=configureStore({
    reducer:{
        user:userReducer
    }
})
