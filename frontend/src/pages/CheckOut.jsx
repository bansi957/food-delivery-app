import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoLocationSharp, IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import { setAddress, setLocation } from "../redux/mapSlice";
import axios from "axios";
import { MdDeliveryDining } from "react-icons/md";
import { FaMobileScreenButton } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa";
import { serverUrl } from "../App";
import { addToMyorders } from "../redux/UserSlice";

function RecenterMap({ location }) {
  if (location.lat && location.lon) {
    const map = useMap();
    map.setView([location.lat, location.lon], 16, { animate: true });
  }
  return null;
}

function CheckOut() {
  const [loading,setLoading]=useState(false)
  const {userData}=useSelector(state=>state.user)
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const APIKEY = import.meta.env.VITE_GEOAPIKEY;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchLoc, setSearchLoc] = useState("");
  const { location, address } = useSelector((state) => state.map);
  const { cartItems, totalAmount } = useSelector((state) => state.user);

  const delieveryFee = totalAmount > 500 ? 0 : 40;
  const amountWithDeliveryFee = totalAmount + delieveryFee;

  useEffect(() => {
    setSearchLoc(address);
  }, [address]);

  const onDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();

    dispatch(
      setLocation({
        lat: lat,
        lon: lng,
      })
    );

    getAddressByLatLang(lat, lng);
  };

  const getCurrentLocation = () => {
      const latitude=userData.user?.location?.coordinates[1]
      const longitude=userData.user?.location?.coordinates[0]
      dispatch(setLocation({ lat: latitude, lon: longitude }));
      getAddressByLatLang(latitude, longitude);
    
  };

  const getLatLonByAddress = async () => {
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          searchLoc
        )}&format=json&apiKey=${APIKEY}`
      );

      if (!res.data.results.length) return null;

      const { lat, lon } = res.data.results[0];

      dispatch(
        setLocation({
          lat: lat,
          lon: lon,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getAddressByLatLang = async (lat, lng) => {
    try {
      const result =
        await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${APIKEY}
`);

      const Add = result.data.results[0].formatted;
      dispatch(setAddress(Add));
      setSearchLoc(Add);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true)
        try {
          const result=await axios.post(`${serverUrl}/api/order/place-order`,{
            paymentMethod,
            deliveryAddress:{
              text:searchLoc,
              latitude:location.lat,
              longitude:location.lon
            },
            totalAmount:amountWithDeliveryFee,
            cartItems
          },{withCredentials:true})
          if(paymentMethod=="cod"){
            dispatch(addToMyorders(result.data))
            navigate("/orderplaced")
          }else{
            const orderId=result.data.orderId
            const razorOrder=result.data.razorOrder
            openRazorpayWindow(orderId,razorOrder)
          }
         
          setLoading(false)
        } catch (error) {
          console.log(error)
          setLoading(false)
        }
  };

const openRazorpayWindow=(orderId,razorOrder)=>{
  const options={
      key:import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:razorOrder.amount,
      currency:"INR",
      name:"Zwiggy",
      description:"Food Delivery Website",
      order_id:razorOrder.id,
      handler:async function (response){
        try {
          const result=await axios.post(`${serverUrl}/api/order/verify-payment`,{razorpay_payment_id:response.razorpay_payment_id,orderId},{withCredentials:true})
           dispatch(addToMyorders(result.data))
            navigate("/orderplaced")
        } catch (error) {
          console.log(error)
        }
      }
  }
    const rzp=new window.Razorpay(options)
    rzp.open()
}

  return (
    <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center p-6">
      <div className="absolute top-5 left-5 z-10">
        <IoIosArrowRoundBack
          size={35}
          className="text-[#ff4d2d] cursor-pointer"
          onClick={() => navigate("/cart")}
        />
      </div>
      <div className="w-full max-w-225 bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800"> CheckOut</h1>
        <section>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800">
            <IoLocationSharp className="text-[#ff4d2d]" /> Delivery Location
          </h2>
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
  <input
    placeholder="Enter Your Delivery Address..."
    type="text"
    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
    value={searchLoc}
    onChange={(e) => setSearchLoc(e.target.value)}
  />

  <div className="flex gap-2 sm:w-auto">
    <button
      onClick={getLatLonByAddress}
      className="flex-1 sm:flex-none bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center"
    >
      <IoSearchOutline size={17} />
    </button>

    <button
      onClick={getCurrentLocation}
      className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center"
    >
      <TbCurrentLocation size={17} />
    </button>
  </div>
</div>

          <div className="rounded-xl border overflow-hidden">
            <div className="h-64 w-full flex items-center justify-center">
              <MapContainer
                className={"w-full h-full"}
                center={[location?.lat, location?.lon]}
                zoom={16}
              >
                {" "}
                <RecenterMap location={location} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[location?.lat, location?.lon]}
                  draggable
                  eventHandlers={{ dragend: onDragEnd }}
                />
              </MapContainer>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Payment Method
          </h2>
          <div className="grid  grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setPaymentMethod("cod")}
              className={`flex items-center gap-3 rounded-xl border p-4  text-left transition ${
                paymentMethod === "cod"
                  ? "border-[#ff4d2d] bg-orange-50 shadow"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <MdDeliveryDining className="text-green-600 text-xl" />
              </span>
              <div>
                <p className="font-medium text-gray-800">Cash On Delivery</p>
                <p className="font-xs text-gray-500">Pay when food arrives</p>
              </div>
            </div>
            <div
              onClick={() => setPaymentMethod("online")}
              className={`flex items-center gap-3 rounded-xl border p-4  text-left transition ${
                paymentMethod === "online"
                  ? "border-[#ff4d2d] bg-orange-50 shadow"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <FaMobileScreenButton className="text-purple-700 text-lg" />
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <FaCreditCard className="text-blue-700 text-lg" />
              </span>
              <div>
                <p className="font-medium text-gray-800">
                  UPI / Credit / Credit Card
                </p>
                <p className="font-xs text-gray-500">Pay Securely Online</p>
              </div>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Order Summary
          </h2>
          <div className="rounded-xl border bg-gray-50 p-4 space-y-2">
            {cartItems.map((item, ind) => (
              <div
                className="flex justify-between text-sm text-gray-700"
                key={ind}
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <hr className="border-gray-200 my-2" />
            <div className="flex justify-between font-medium text-gray-800">
              <span>SubTotal</span>
              <span>₹{totalAmount}</span>
            </div>

            <div className="flex justify-between text-gray-700">
              <span>Delivery Fee</span>
              <span>{delieveryFee == 0 ? "Free" : "₹" + delieveryFee}</span>
            </div>

            <div className="flex justify-between text-lg font-bold text-[#ff4d2d]">
              <span>Total</span>
              <span>₹{amountWithDeliveryFee}</span>
            </div>
          </div>
        </section>

        <button  className="w-full bg-[#ff4d2d] rounded-xl font-semibold text-white py-3 hover:bg-[#e64526]" onClick={handlePlaceOrder}>
        {loading ?<ClipLoader size={20} color='white'/>:(paymentMethod == "cod" ? "Place Order" : "Pay and Place Order")}
        </button>
      </div>
    </div>
  );
}

export default CheckOut;
