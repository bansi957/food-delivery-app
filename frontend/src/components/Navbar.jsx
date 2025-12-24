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
import { setUserData } from "../redux/UserSlice";
function NavBar() {
  const { city } = useSelector((state) => state.user);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    //logout functionality
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      console.log(result);
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-20 flex items-center justify-between md:justify-center gap-8 px-5 fixed top-0 z-50 bg-[#fff9f6] overflow-visible">
      {userData.role == "user" && showSearch && (
        <div className="flex md:hidden fixed top-20 left-[5%] w-full bg-white z-50 p-3  items-center gap-5 shadow-xl  rounded-lg">
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
                type="text"
                placeholder="Search delicious food..."
                className="w-full px-2.5 text-gray-700 outline-0 "
              />
            </label>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-2 text-[#ff4d2d]">Swiggy</h1>
      {userData.role == "user" && (
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
                type="text"
                placeholder="Search delicious food..."
                className="w-full px-2.5 text-gray-700 outline-0 "
              />
            </label>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        {userData.role == "user" &&
          (showSearch ? (
            <RxCross2
              size={25}
              className="text-[#ff4d2d] cursor-pointer md:hidden"
              onClick={() => setShowSearch(false)}
            />
          ) : (
            <IoIosSearch
              size={25}
              className="text-[#ff4d2d] cursor-pointer md:hidden "
              onClick={() => setShowSearch(true)}
            />
          ))}

          {userData.role == "owner" && (
          <button
            className="flex items-center gap-1 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium"
          >
           <FaPlus size={25} />
           <span className="ml-2"> Add Dish</span>
          </button>
        )}

        {userData.role == "user" && (
          <div className=" relative cursor-pointer">
            <FiShoppingCart size={25} className="text-[#ff4d2d]" />
            <span className="absolute -right-2 -top-3 text-[#ff4d2d]"> 0</span>
          </div>
        )}
        <button className="hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium">
          My Orders
        </button>
        <div
          className="w-10 h-10 rounded-full bg-[#ff4d2d] text-white shadow-xl flex items-center justify-center font-semibold cursor-pointer"
          onClick={() => setShowInfo((prev) => !prev)}
        >
          {userData?.user?.fullName.slice(0, 1).toUpperCase() || "U"}
        </div>
        {showInfo && (
          <div className="fixed top-20 right-2.5 md:right-[10%] lg:right-[20%] w-44 bg-white shadow-2xl rounded-lg p-3 flex flex-col gap-3 z-9999 ">
            <div className="font-semibold text-base">
              {userData?.user?.fullName || "User"}
            </div>
            <div className="text-[#ff4d2d] md:hidden font-semibold cursor-pointer">
              {" "}
              My Orders
            </div>
            <div
              className="text-[#ff4d2d] font-semibold cursor-pointer"
              onClick={handleLogout}
            >
              {" "}
              Log Out
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
