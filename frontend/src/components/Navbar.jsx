import { getSocket } from "../../socket";
import { addToMyorders } from "../redux/UserSlice";
import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { setSearchItems, setUserData } from "../redux/UserSlice";
import {TbReceipt2} from "react-icons/tb";
import { useEffect } from "react";
function Navbar() {
  const [query,setQuery]=useState("")
  const { city,myorders} = useSelector((state) => state.user);
  const {myShopData}=useSelector((state)=>state.owner)
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { userData,cartItems } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    //logout functionality
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });

      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };
  //   const handleSearchItems=async ()=>{
  //      try {
  //       const result=await axios.get(`${serverUrl}/api/item/search-items?query=${query}&city=srikakulam`,{withCredentials:true})
  //       dispatch(setSearchItems(result.data))
  //      } catch (error) {
  //       console.log(error)
  //      }
  //   }  
  //   useEffect(()=>{
  //     const trimmedquery=(query||"").trim()
  //     if(query && trimmedquery.length>=2){
  //       handleSearchItems()
  //     }
  //     else{
  //       dispatch(setSearchItems(null))
  //     }
  // },[query])
useEffect(() => {
  const trimmedQuery = (query || "").trim();

  const timer = setTimeout(() => {
    if (trimmedQuery.length > 0) {
      handleSearchItems();
    } else {
      dispatch(setSearchItems(null));
    }
  }, 400); // debounce delay

  return () => clearTimeout(timer);
}, [query]);
const [count,setCount]=useState(0)
useEffect(()=>{
  setCount(myorders?.length)
},[myorders,userData])

useEffect(() => {
  if (userData?.user?.role !== "owner") return;

  const socket = getSocket();

  const handleNewOrder = (data) => {
    if (data?.shopOrders?.owner?._id === userData.user._id) {
      dispatch(addToMyorders(data));
    }
  };

  socket.on("newOrder", handleNewOrder);

  return () => {
    socket.off("newOrder", handleNewOrder);
  };
}, [userData?.user?._id, dispatch]);
  return (
    <div className="w-full h-20 flex items-center justify-between md:justify-center gap-8 px-5 fixed top-0 z-50 bg-[#fff9f6] overflow-visible">
      {userData.user.role == "user" && showSearch && (
        <div className="flex md:hidden fixed top-20 inset-x-0 mx-auto w-[90%] bg-white z-50 p-3  items-center gap-5 shadow-xl  rounded-lg">
          <div className="flex items-center w-[30%] overflow-hidden gap-2.5 px-2.5 border-r-2 border-gray-400">
            <FaLocationDot size={25} className="text-[#ff4d2d]" />
            <div className="w-[80%] truncate text-gray-600 ">{city}</div>
          </div>
          <div className="w-[80%]  flex items-center gap-2.5">
            <label className="flex">
              <IoIosSearch
                size={25}
                className="text-[#ff4d2d] cursor-pointer"
              />{" "}
              <input
              onChange={(e)=>setQuery(e.target.value)}
                type="text"
                value={query}
                placeholder="Search delicious food..."
                className="w-full px-2.5 text-gray-700 outline-0 "
              />
            </label>
          </div>
        </div>
      )}


      <h1 className="text-3xl font-bold mb-2 text-[#ff4d2d]">Zwiggy</h1>
      {userData.user.role == "user" && (
        <div className="  items-center md:w-3/5 lg:w-2/5 h-16 bg-white shadow-xl rounded-lg gap-5  hidden  md:flex">
          <div className="flex items-center w-[30%] overflow-hidden gap-2.5 px-2.5 border-r-2 border-gray-400">
            <FaLocationDot size={25} className="text-[#ff4d2d]" />
            <div className="w-[80%] truncate text-gray-600 ">{city}</div>
          </div>
          <div className="w-[80%] flex items-center gap-2.5">
            <label className="flex">
              <IoIosSearch
                size={25}
                className="text-[#ff4d2d] cursor-pointer"
              />{" "}
              <input
              onChange={(e)=>setQuery(e.target.value)}
                type="text"
                value={query}
                placeholder="Search delicious food..."
                className="w-full px-2.5 text-gray-700 outline-0 "
              />
            </label>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        {userData.user.role == "user" &&
          (showSearch ? (
            <RxCross2
              
              size={25}
              className="text-[#ff4d2d] cursor-pointer md:hidden"
              onClick={() => {setShowSearch(false); setQuery("");}}
            />
          ) : (
            <IoIosSearch
              size={25}
              className="text-[#ff4d2d] cursor-pointer md:hidden "
              onClick={() => {setShowSearch(true)}}
            />
          ))}

          {userData.user.role == "owner" ? <>
          {myShopData && <>
           <button
            onClick={()=>navigate("/add-food")} className=" md:flex hidden  items-center gap-1 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d] "
          >
           <FaPlus size={20} />
           <span className="ml-2"> Add Food Item</span>
          </button>

          <button
            onClick={()=>navigate("/add-food")} className=" md:hidden flex items-center  p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d] "
          >
           <FaPlus size={20} />
          
          </button>

          

          </>} 
          <div  className="md:flex hidden items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium" onClick={()=>navigate("/my-orders")}>
            <TbReceipt2 size={20} className="text-[#ff4d2d] cursor-pointer" />
            <span>My Orders</span>
            <span className="absolute right-0 -top-1 translate-x-1/2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-1.5 py-0.5">{count}</span>
          </div>

          <div onClick={()=>navigate("/my-orders")} className="md:hidden flex items-center gap-2 cursor-pointer relative p-2 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium">
            <TbReceipt2 size={20} className="text-[#ff4d2d] cursor-pointer" />
            <span className="absolute right-0 -top-1 translate-x-1/2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-1.5 py-0.5">{count}</span>

          </div>
         

          </>
          :<>{userData.user.role=="user" &&<> <div onClick={()=>navigate("/cart")} className=" relative cursor-pointer">
            <FiShoppingCart size={25} className="text-[#ff4d2d]" />
            <span className="absolute -right-2 -top-3 text-[#ff4d2d]"> {cartItems.length}</span>
          </div>
        
        <button onClick={()=>navigate("/my-orders")} className="hidden md:block px-3 py-1 cursor-pointer rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium">
          My Orders
        </button></>}</>
        }

      
       <div className="relative">
  {/* Avatar */}
  <div
    className="w-10 h-10 rounded-full bg-[#ff4d2d] text-white shadow-xl flex items-center justify-center font-semibold cursor-pointer"
    onClick={() => setShowInfo((prev) => !prev)}
  >
    {userData?.user?.fullName?.slice(0, 1).toUpperCase() || "U"}
  </div>

  {/* Dropdown */}
  {showInfo && (
    <div className="absolute top-12 right-0 w-44 bg-white shadow-2xl rounded-lg p-3 flex flex-col gap-3 z-50">
      <div className="font-semibold text-base">
        {userData?.user?.fullName || "User"}
      </div>

      {(userData?.user?.role === "user")&&
        <div onClick={()=>navigate("/my-orders")} className="text-[#ff4d2d] md:hidden font-semibold cursor-pointer">
          My Orders
        </div>
}

      <div
        className="text-[#ff4d2d] font-semibold cursor-pointer"
        onClick={handleLogout}
      >
        Log Out
      </div>
    </div>
  )}
</div>
      </div>
    </div>
  );
}

export default Navbar;
