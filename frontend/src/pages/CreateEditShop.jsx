import React, { useState} from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";
function CreateEditShop() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading,setLoading]=useState(false)
  const {city,state,currentAdress} = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.owner);
  const [name,setName]=useState(myShopData?.name || "")
  const [City,setCity]=useState(myShopData?.city || city)
  const [State,setState]=useState(myShopData?.state || state)
  const [address,setAddress]=useState(myShopData?.address || currentAdress)
  const [frontendImage,setFrontendImage]=useState(myShopData?.image || null)
  const [backendImage,setBackendImage]=useState(null)

   
 const handleSubmit= async (e)=>{
    e.preventDefault();
   try {
    setLoading(true)
    const formData=new FormData();
    formData.append("name",name)
    formData.append("city",City)
    formData.append("state",State)
    formData.append("address",address)
    if(backendImage){
        formData.append("image",backendImage)
    }
    const result=await axios.post(`${serverUrl}/api/shop/create-edit`,formData,{withCredentials:true})
    dispatch(setMyShopData(result.data.shop))
    setLoading(false)
    navigate("/");
   } catch (error) {
    console.log(error)
     setLoading(false)
   }
}

  const handleImage=(e)=>{
    const file=e.target.files[0];
    if(!file)return;
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
}
  return (
    <div className="flex justify-center items-center p-6 bg-linear-to-br from-orange-50 to-white relative min-h-screen">
      <div className="absolute top-5 left-5 z-10 mb-2.5">
        <IoIosArrowRoundBack
          size={35}
          className="text-[#ff4d2d] cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100">
        <div className="flex flex-col items-center mb-6 ">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <FaUtensils className="text-[#ff4d2d] w-16 h-16" />
          </div>
          <div>
            {myShopData ? (
              <h2 className="text-2xl font-bold mb-4 text-center">
                Edit Shop{" "}
              </h2>
            ) : (
              <h2 className="text-2xl font-bold mb-4 text-center">Add Shop</h2>
            )}
          </div>
        </div>
        <form className="space-y-5"  onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter Shop Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Image
            </label>
            <input
              type="file"
              onChange={handleImage}
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              accept="image/*"
            />
            {frontendImage && (<img src={frontendImage} alt="Shop" className="mt-4 w-full h-48 object-cover rounded-lg border"/>)}
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div> <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={City}
              onChange={(e)=>setCity(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter City"
            /> </div>
            <div> <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <input
              type="text"
              value={State}
                onChange={(e)=>setState(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter State"
            /></div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
             </label>
            <input
                value={address}
                onChange={(e)=>setAddress(e.target.value)}
              type="text"
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter Shop Address"
            />
          </div>

          <button type="submit" className="w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600  hover:shadow-lg transition-all cursor-pointer duration-200">
            {loading ? <ClipLoader size={20} color='white'/> : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEditShop;
