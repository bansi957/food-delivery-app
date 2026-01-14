import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";


const userSlice=createSlice({
    name:"user",
    initialState:{
        userData:null,
        city:null,
        state:null,
        currentAdress:null,
        shopsInMyCity:null,
        cartItems:[],
        totalAmount:0,
        myorders:[],
        searchItems:null,
        
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
        },
        addToCart:(state,action)=>{
            const cartItems=action.payload
            const existing=state.cartItems.find(i=>i.id==cartItems.id)
            if(existing){
                existing.quantity+=cartItems.quantity
            }else{
            state.cartItems.push(cartItems)}
         state.totalAmount=state.cartItems.reduce((sum,i)=>sum+i.price*i.quantity,0)
        },
        updateQuantity(state,action){
            const {id,quantity}=action.payload
            const item=state.cartItems.find(i=>i.id==id)
            if(item){
                item.quantity=quantity
            }
            state.totalAmount=state.cartItems.reduce((sum,i)=>sum+i.price*i.quantity,0)

        },

        removeCartItem(state,action){
            state.cartItems=state.cartItems.filter(i=>i.id!==action.payload)
            state.totalAmount=state.cartItems.reduce((sum,i)=>sum+i.price*i.quantity,0)
        },
        setMyOrders(state,action){
            state.myorders=action.payload
        },
        addToMyorders(state,action){
            state.myorders=[action.payload,...state.myorders]
        },
        updateOrderStatus(state,action){
            const {orderId,shopId,status}=action.payload
            const order=state.myorders.find(o=>o._id==orderId)
            if(order && order.shopOrders.shop._id==shopId){
                order.shopOrders.status=status
            }
            
        },
        setSearchItems(state,action){
            state.searchItems=action.payload
        },
       
    }   
})

export const {setSearchItems,updateOrderStatus,addToMyorders,setMyOrders,setUserData,setCity,setState,setCurrentAdress,setShopsInMyCity,addToCart,updateQuantity,removeCartItem}=userSlice.actions
export default userSlice.reducer