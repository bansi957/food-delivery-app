import React, { useEffect, useRef, useState } from "react";
import Navbar from "./NavBar";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";

function UserDashBoard() {
  const cateScrollRef = useRef();
    const ShopScrollRef = useRef();
    const {shopsInMyCity}=useSelector(state=>state.user);

  const [showLeftCatButton, setShowLeftCatbutton] = useState(false);
  const [showRightCatButton, setShowRightCatbutton] = useState(false);

  const [showLeftShopButton, setShowLeftShopbutton] = useState(false);
  const [showRightShopButton, setShowRightShopbutton] = useState(false);
  const { city } = useSelector((state) => state.user);
  const updateButton = (ref,left,right) => {
    const element = ref.current;
    if (element) {
      left(element.scrollLeft > 0);
      right(
        element.scrollLeft + element.clientWidth < element.scrollWidth - 1
      );
    }
  };

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction == "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

useEffect(() => {
  const cateElement = cateScrollRef.current;
  const shopElement = ShopScrollRef.current;

  if (!cateElement && !shopElement) return;

  const handleScroll = () => {
    if (cateScrollRef.current) {
      updateButton(
        cateScrollRef,
        setShowLeftCatbutton,
        setShowRightCatbutton
      );
    }

    if (ShopScrollRef.current) {
      updateButton(
        ShopScrollRef,
        setShowLeftShopbutton,
        setShowRightShopbutton
      );
    }
  };

  // 🔥 CALL ONCE INITIALLY
  handleScroll();

  // Add listeners
  cateElement?.addEventListener("scroll", handleScroll);
  shopElement?.addEventListener("scroll", handleScroll);

  // Cleanup
  return () => {
    cateElement?.removeEventListener("scroll", handleScroll);
    shopElement?.removeEventListener("scroll", handleScroll);
  };
}, [categories, shopsInMyCity]);



  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <Navbar />

      <div className="w-full max-w-6xl flex flex-col gap-5 item-start p-2.5">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          {" "}
          Inspiration for your first order{" "}
        </h1>
        <div className="w-full relative">
          {showLeftCatButton && (
            <button
              onClick={() => {
                scrollHandler(cateScrollRef, "left");
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
            >
              <FaCircleChevronLeft />
            </button>
          )}
          <div
            className="w-full flex overflow-x-auto gap-4 pb-2 "
            ref={cateScrollRef}
          >
            {categories.map((cat, ind) => (
              <CategoryCard data={cat} key={ind} />
            ))}
          </div>
          {showRightCatButton && (
            <button
              onClick={() => {
                scrollHandler(cateScrollRef, "right");
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
            >
              <FaCircleChevronRight />
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-5 item-start p-2.5">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Best Shop in {city}
        </h1>
        <div className="w-full relative">
          {showLeftShopButton && (
            <button
              onClick={() => {
                scrollHandler(ShopScrollRef, "left");
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
            >
              <FaCircleChevronLeft />
            </button>
          )}
          <div
            className="w-full flex overflow-x-auto gap-4 pb-2 "
            ref={ShopScrollRef}
          >
            
            {shopsInMyCity && shopsInMyCity.map((shop, ind) => (
              <CategoryCard   data={{ category: shop.name, image: shop.image }}  key={ind} />
            ))}
          </div>
          {showRightShopButton && (
            <button
              onClick={() => {
                scrollHandler(ShopScrollRef, "right");
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
            >
              <FaCircleChevronRight />
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-5 item-start p-2.5">
          <h1 className="text-gray-800 text-2xl sm:text-3xl">
            Suggested Food Items
        </h1>
        {shopsInMyCity&& 
        <div>
            {shopsInMyCity &&
    shopsInMyCity.map((shop, shopIndex) => (
      <div key={shopIndex} className="flex gap-4 flex-wrap mb-5">
        {shop.items?.map((item, ind) => (
          <FoodCard data={item} key={ind} />
        ))}
      </div>
    ))}
        </div>
        }
        
       
      </div>
    </div>
  );
}

export default UserDashBoard;
