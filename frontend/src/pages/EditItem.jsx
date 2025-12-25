import React, { useEffect, useState} from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FaUtensils } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";
import axios from "axios";
import { serverUrl } from "../App";

import { ClipLoader } from "react-spinners";
function EditItem() {
    const {id}=useParams()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading,setLoading]=useState(false)
  const [category,setCategory]=useState("")
  const [foodType,setFoodType]=useState("Veg")
  
    const categories=[ "Snacks",
      "Main Course",
      "Beverages",
      "Desserts",
      "Pizza",
      "Burgers",
      "Salads",
      "Soups",
      "Sandwiches",
      "Northern Indian",
      "South Indian",
      "Chinese",
      "Fast Food",
      "Others"]

  const [name,setName]=useState("")
  const [frontendImage,setFrontendImage]=useState(null)
  const [backendImage,setBackendImage]=useState(null)
    const [price,setPrice]=useState(0)
   
 const handleSubmit= async (e)=>{
    e.preventDefault();
    setLoading(true)
   try {
    const formData=new FormData();
    formData.append("name",name)
    formData.append("category",category)
    formData.append("foodType",foodType)
    formData.append("price",price)
    if(backendImage){
        formData.append("image",backendImage)
    }
    const result=await axios.put(`${serverUrl}/api/item/edit-item/${id}`,formData,{withCredentials:true})
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

    useEffect(()=>{
        const fetchItem=async()=>{
            try {
                const result=await axios.get(`${serverUrl}/api/item/get-item/${id}`,{withCredentials:true})
                setName(result.data.item.name)
                setCategory(result.data.item.category)
                setPrice(result.data.item.price)
                setFoodType(result.data.item.foodType)
                setFrontendImage(result.data.item.image)
            } catch (error) {
                console.log(error)
            }
        }
        fetchItem()
    },[id])
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
              <h2 className="text-2xl font-bold mb-4 text-center">Edit Food </h2>
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
              placeholder="Enter Food Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Image
            </label>
            <input
              type="file"
              onChange={handleImage}
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              accept="image/*"
            />
            {frontendImage && (<img src={frontendImage} alt="Shop" className="mt-4 w-full h-48 object-cover rounded-lg border"/>)}
          </div>  

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e)=>setPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
            /></div>       
          
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Category
            </label>
            <select
              
              value={category}
              onChange={(e)=>setCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
            >
                <option value="">Select Category</option>
                {categories.map((cat,ind)=>(
                    <option value={cat} key={ind}>{cat}</option>
                ))}

            </select>
          </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Food type
            </label>
            <select
        
              value={foodType}
              onChange={(e)=>setFoodType(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
            >
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600  hover:shadow-lg transition-all cursor-pointer duration-200">
            {loading ? <ClipLoader size={20} color='white'/> : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditItem;
