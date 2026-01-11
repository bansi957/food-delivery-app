// import React from "react";
// import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
// import { useRef, useState, useEffect } from "react";

// function UserMyOrdersCard({ data }) {
//   const scrollRefs = useRef([]);
// const [showLeft, setShowLeft] = useState({});
// const [showRight, setShowRight] = useState({});

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const updateButtons = (index) => {
//   const el = scrollRefs.current[index];
//   if (!el) return;

//   setShowLeft((prev) => ({
//     ...prev,
//     [index]: el.scrollLeft > 0,
//   }));

//   setShowRight((prev) => ({
//     ...prev,
//     [index]:
//       el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
//   }));
// };

// const scrollHandler = (index, direction) => {
//   const el = scrollRefs.current[index];
//   if (!el) return;

//   el.scrollBy({
//     left: direction === "left" ? -200 : 200,
//     behavior: "smooth",
//   });
// };


// useEffect(() => {
//   data.shopOrders.forEach((_, index) => updateButtons(index));

//   window.addEventListener("resize", () => {
//     data.shopOrders.forEach((_, index) => updateButtons(index));
//   });

//   return () => window.removeEventListener("resize", () => {});
// }, [data.shopOrders]);

//   return (
//     <div className="bg-white rounded-lg shadow p-4 space-y-4">
//       <div className="relative">
//   {showLeft[ind] && (
//     <button
//       onClick={() => scrollHandler(ind, "left")}
//       className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full z-10"
//     >
//       <FaCircleChevronLeft />
//     </button>
//   )}

//   <div
//     ref={(el) => (scrollRefs.current[ind] = el)}
//     onScroll={() => updateButtons(ind)}
//     className="flex space-x-4 overflow-x-auto pb-2 scroll-smooth"
//   >
//     {shopOrder.shopOrderItems.map((item, i) => (
//       <div
//         key={i}
//         className="shrink-0 w-40 rounded-lg p-2 border bg-white"
//       >
//         <img
//           src={item.item.image}
//           className="w-full h-24 object-cover rounded"
//         />
//         <p className="text-sm font-semibold mt-1">{item.name}</p>
//         <p className="text-xs text-gray-500">
//           Qty: {item.quantity} x ₹{item.price}
//         </p>
//       </div>
//     ))}
//   </div>

//   {showRight[ind] && (
//     <button
//       onClick={() => scrollHandler(ind, "right")}
//       className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full z-10"
//     >
//       <FaCircleChevronRight />
//     </button>
//   )}
// </div>

//         <div>
//           <p className="font-semibold">order #{data._id.slice(-6)}</p>
//           <p className="text-sm text-gray-500">
//             Date: {formatDate(data.createdAt)}
//           </p>
//         </div>
//         <div className="text-right ">
//           <p className="text-sm text-gray-500">
//             {data.paymentMethod?.toUpperCase()}
//           </p>
//           <p className="font-medium text-blue-600">
//             {data.shopOrders[0].status}
//           </p>
//         </div>
//       </div>
//       {data.shopOrders.map((shopOrder, ind) => (
//         <div className=" rounded-lg p-3 bg-[#fffaf7] space-y-3" key={ind}>
//           <p>{shopOrder.shop.name}</p>
//           <div className="flex space-x-4 overflow-x-auto pb-2">
//             {shopOrder.shopOrderItems.map((item, ind) => (
//               <div
//                 key={ind}
//                 className="shrink-0 w-40 rounded-lg p-2 border bg-white"
//               >
//                 <img
//                   src={item.item.image}
//                   className="w-full h-24 object-cover rounded"
//                 />
//                 <p className="text-sm font-semibold mt-1">{item.name}</p>
//                 <p className="text-xs text-gray-500">
//                   Qty: {item.quantity} x ₹{item.price}
//                 </p>
//               </div>
//             ))}
//           </div>
//           <div className="flex items-center justify-between border-t pt-2">
//             <p className="font-semibold">SubTotal: ₹{shopOrder.subTotal}</p>
//             <p className="text-sm font-medium text-blue-600">
//               {shopOrder.status}
//             </p>
//           </div>
//         </div>
//       ))}

//       <div className="flex justify-between items-center border-t pt-2">
//         <p className="font-semibold "> Total: ₹{data.totalAmount}</p>
//         <button className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-4 py-2 rounded-lg text-sm">
//           Track Order
//         </button>
//       </div>
//     </div>
//   );
// }

// export default UserMyOrdersCard;
import React, { useRef, useState, useEffect } from "react";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function UserMyOrdersCard({ data }) {
  const scrollRefs = useRef([]);
  const [showLeft, setShowLeft] = useState({});
  const [showRight, setShowRight] = useState({});
  const navigate=useNavigate()
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const updateButtons = (index) => {
    const el = scrollRefs.current[index];
    if (!el) return;

    setShowLeft((prev) => ({
      ...prev,
      [index]: el.scrollLeft > 0,
    }));

    setShowRight((prev) => ({
      ...prev,
      [index]:
        el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
    }));
  };

  const scrollHandler = (index, dir) => {
    scrollRefs.current[index]?.scrollBy({
      left: dir === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    data.shopOrders.forEach((_, i) => updateButtons(i));

    const handleResize = () =>
      data.shopOrders.forEach((_, i) => updateButtons(i));

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [data.shopOrders]);

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      {/* Order header */}
      <div className="flex justify-between border-b pb-2">
        <div>
          <p className="font-semibold">
            Order #{data._id.slice(-6)}
          </p>
          <p className="text-sm text-gray-500">
            Date: {formatDate(data.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {data.paymentMethod?.toUpperCase()}
          </p>
          <p className="font-medium text-blue-600">
            {data.shopOrders[0].status}
          </p>
        </div>
      </div>

      {/* Shop Orders */}
      {data.shopOrders.map((shopOrder, ind) => (
        <div key={ind} className="bg-[#fffaf7] rounded-lg p-3 space-y-3">
          <p className="font-medium">{shopOrder.shop.name}</p>

          <div className="relative">
            {showLeft[ind] && (
              <button
                onClick={() => scrollHandler(ind, "left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full z-10"
              >
                <FaCircleChevronLeft />
              </button>
            )}

            <div
              ref={(el) => (scrollRefs.current[ind] = el)}
              onScroll={() => updateButtons(ind)}
              className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
            >
              {shopOrder.shopOrderItems.map((item, i) => (
                <div
                  key={i}
                  className="shrink-0 w-40 bg-white border rounded-lg p-2"
                >
                  <img
                    src={item.item.image}
                    className="w-full h-24 object-cover rounded"
                  />
                  <p className="text-sm font-semibold mt-1">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Qty: {item.quantity} × ₹{item.price}
                  </p>
                </div>
              ))}
            </div>

            {showRight[ind] && (
              <button
                onClick={() => scrollHandler(ind, "right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full z-10"
              >
                <FaCircleChevronRight />
              </button>
            )}
          </div>

          <div className="flex justify-between border-t pt-2">
            <p className="font-semibold">
              SubTotal: ₹{shopOrder.subTotal}
            </p>
            <p className="text-sm font-medium text-blue-600">
              {shopOrder.status}
            </p>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="flex justify-between border-t pt-2">
        <p className="font-semibold">
          Total: ₹{data.totalAmount}
        </p>
        <button onClick={()=>navigate(`/track-order/${data._id}`)} className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-4 py-2 rounded-lg text-sm">
          Track Order
        </button>
      </div>
    </div>
  );
}

export default UserMyOrdersCard;
