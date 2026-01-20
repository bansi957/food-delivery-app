import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";
import { useNavigate } from "react-router-dom";

function UserDashBoard() {
  const navigate=useNavigate()
  const cateScrollRef = useRef();
    const ShopScrollRef = useRef();
    const [itemText,setItemtext]=useState("Suggested Food Items")
    const {shopsInMyCity,searchItems}=useSelector(state=>state.user);
  const [updatedItemsList,setupdatedItemsList]=useState([])
  const [showLeftCatButton, setShowLeftCatbutton] = useState(false);
  const [showRightCatButton, setShowRightCatbutton] = useState(false);
  const [itemsInMyCity,setItemsInMyCity]=useState([])
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

  const handleScrollOrResize = () => {
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

  // ✅ Run once initially
  handleScrollOrResize();

  // Scroll listeners
  cateElement?.addEventListener("scroll", handleScrollOrResize);
  shopElement?.addEventListener("scroll", handleScrollOrResize);

  // ✅ Resize listener (IMPORTANT)
  window.addEventListener("resize", handleScrollOrResize);

  return () => {
    cateElement?.removeEventListener("scroll", handleScrollOrResize);
    shopElement?.removeEventListener("scroll", handleScrollOrResize);
    window.removeEventListener("resize", handleScrollOrResize);
  };
}, [categories, shopsInMyCity]);

const handleFilterByCategory=(category)=>{
    if(category=="All"){
      setItemtext("Suggested Food Items")
      setupdatedItemsList(itemsInMyCity)
    }
    else{
      const filteredItems=itemsInMyCity.filter(i=>i.category===category)
      setItemtext(category)
      setupdatedItemsList(filteredItems)
    }
}

useEffect(()=>{
  let arr=[]
  shopsInMyCity?.map((shop)=>{shop?.items?.map((item)=>{arr.push(item)})})
  setItemsInMyCity(arr)
  setupdatedItemsList(arr)
},[shopsInMyCity])

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <Navbar />
      {searchItems && searchItems.length>0 && <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl mt-4">
        <h1 className="text-gray-900 text-2xl sm:text-3xl font-semibold border-b border-gray-200 pb-2">Search Results</h1>
        <div className="w-full flex flex-wrap gap-6 justify-center">
          {searchItems.map((item,ind)=>(<FoodCard data={item} key={ind}/>))}
        </div>
        </div>}
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
              <CategoryCard onClick={()=>handleFilterByCategory(cat.category)} data={cat} key={ind} />
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
          Best Shops in {city}
        </h1>

        {shopsInMyCity?.length>0 ?<>
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
              <CategoryCard onClick={()=>navigate(`/shop/${shop._id}`)} data={{ category: shop.name, image: shop.image }}  key={ind} />
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
        </> :<div>
     <p className="text-gray-500 text-lg mt-4">
      No Shops available in {city}
    </p>
  </div>
        }
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-5 item-start p-2.5">
          <h1 className="text-gray-800 text-2xl sm:text-3xl">
               {itemText}
        </h1>
        {itemsInMyCity?.length>0 ?
  <div className="w-full h-auto flex flex-wrap gap-5 justify-center">
    {
      updatedItemsList?.length>0 ?<>{updatedItemsList.map((item) => (
        <FoodCard
          key={item._id}   // ✅ unique key
          data={item}
        />
      ))}</>:<p className="text-gray-500 text-lg mt-4">No food items available in this category </p>
    }
  </div> :<div>
     <p className="text-gray-500 text-lg mt-4">
      No food items available in {city}
    </p>
  </div>
}

        
       
      </div>
    </div>
  );
}

export default UserDashBoard;
