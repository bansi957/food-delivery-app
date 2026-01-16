import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { IoIosArrowRoundBack } from "react-icons/io";
import DeliveryBoyTracking from "../components/DeliveryBoyTracking";
import { getSocket } from "../../socket";import { useSelector } from "react-redux";

function TrackOrder() {
  const { orderId } = useParams();
  const [currentOrder, setcurrentOrder] = useState();
  const [liveLoaction,setLiveLocation]=useState({})
  const handleGetOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-order-by-id/${orderId}`,
        { withCredentials: true }
      );
      setcurrentOrder(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleGetOrder();
  }, [orderId]);

  useEffect(() => {
      const socket = getSocket();
    socket.on(
      "update-delivery-location",
      ({ longitude, latitude, deliveryBoyId }) => {
          setLiveLocation(prev=>({...prev,[deliveryBoyId]:{lat:latitude,lon:longitude}}))
      }
    )

    return()=>{socket.off("update-delivery-location");
    }
  }, []);
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
      <div className="relative flex items-center gap-4 top-5 left-5 z-2.5 mb-2.5">
        <IoIosArrowRoundBack
          size={35}
          className="text-[#ff4d2d] cursor-pointer"
          onClick={() => navigate("/my-orders")}
        />
        <h1 className="text-2xl font-bold md:text-center">track Order</h1>
      </div>

      {currentOrder?.shopOrders?.map((shopOrder, ind) => (
        <div
          className="bg-white p-4 rounded-2xl shadow-md border border-orange-100 space-y-4"
          key={ind}
        >
          <div>
            <p className="text-lg font-bold mb-2 text-[#ff4d2d]">
              {shopOrder.shop.name}
            </p>
            <p className="font-semibold">
              {" "}
              <span>Items:</span>{" "}
              {shopOrder.shopOrderItems?.map((i) => i.name).join(",")}
            </p>
            <p>
              <span className="font-semibold">Subtotal:</span> ₹
              {shopOrder.subTotal}
            </p>
            <p className="mt-6">  
              <span className="font-semibold">Delivery Address:</span>{" "}
              {currentOrder.deliveryAddress.text}
            </p>
          </div>

          {shopOrder.status != "delivered" ? (
            <>
              {shopOrder.assignedDeliveryBoy ? (
                <div className="text-sm text-gray-700">
                  <p className="font-semibold ">
                    <span>DeliveryBoy Name:</span>{" "}
                    {shopOrder.assignedDeliveryBoy.fullName}
                  </p>
                  <p className="font-semibold">
                    <span>DeliveryBoy contact No:</span>{" "}
                    {shopOrder.assignedDeliveryBoy.mobile}
                  </p>
                </div>
              ) : (
                <p className="font-semibold">
                  {" "}
                  Delivery Boy is not assigned yet.
                </p>
              )}
            </>
          ) : (
            <p className="text-green-600 font-semibold text-lg">Delivered</p>
          )}

          {shopOrder.assignedDeliveryBoy &&
            shopOrder.status !== "delivered" && (
              <div className="h-100 w-full rounded-2xl overflow-hidden shadow-md">
                <DeliveryBoyTracking
                  data={{

                    deliveryBoyLocation:liveLoaction[shopOrder.assignedDeliveryBoy._id] ||{

                      lon: shopOrder.assignedDeliveryBoy.location
                        .coordinates[0],
                      lat: shopOrder.assignedDeliveryBoy.location
                        .coordinates[1],
                    },
                    customerLocation: {
                      lat: currentOrder.deliveryAddress.latitude,
                      lon: currentOrder.deliveryAddress.longitude,
                    },
                  }}
                />
              </div>
            )}
        </div>
      ))}
    </div>
  );
}

export default TrackOrder;
