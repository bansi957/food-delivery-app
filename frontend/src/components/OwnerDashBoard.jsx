import React from "react";
import NavBar from "./NavBar";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa6";

function OwnerDashBoard() {
  const { myShopData } = useSelector((state) => state.owner);
  return (
    <>
      <NavBar />
      {!myShopData && (
        <div className="flex justify-center item-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4" />
              <h2 className="text-xl font-bold sm:text-2xl text-gray-800 mb-2">
                Add Your Restaurant
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                {" "}
                Join our food delivery platform and reach hundreds of hungry
                customers every day.{" "}
              </p>
              <button className="bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full shadow-md font-medium hover:bg-orange-600 transition-colors duration-200 ">
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OwnerDashBoard;
