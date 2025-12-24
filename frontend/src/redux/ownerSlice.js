import { createSlice } from "@reduxjs/toolkit";

const ownerSlice=createSlice({
    name:"owner",
    initialState:{
        MyshopData:null,
       },
    reducers:{
        setMyShopData:(state,action)=>{
            state.MyshopData=action.payload
        }
}})

export const {setMyShopData}=ownerSlice.actions
export default ownerSlice.reducer