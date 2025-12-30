import { createSlice, current } from "@reduxjs/toolkit";


const userSlice=createSlice({
    name:"user",
    initialState:{
        userData:null,
        city:null,
        state:null,
        currentAdress:null,
        shopsInMyCity:null
    },
    reducers:{
        setUserData:(state,action)=>{
            state.userData=action.payload
        },
        setCity:(state,action)=>{
            state.city=action.payload
        },
        setState:(state,action)=>{
            state.state=action.payload
        },
        setCurrentAdress:(state,action)=>{
            state.currentAdress=action.payload
        },
        setShopsInMyCity(state,action){
            state.shopsInMyCity=action.payload
        }
    }   
})

export const {setUserData,setCity,setState,setCurrentAdress,setShopsInMyCity}=userSlice.actions
export default userSlice.reducer