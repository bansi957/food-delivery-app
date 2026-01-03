import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/UserSlice";
function SignIn() {
  const [loading,setLoading]=useState(false)
  const primaryColor = "#ff4d2d";
  const bgColor = "#fff9f6";
  const borderColor = "#e5e5e5";
  const [err,setError]=useState("")
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const [showPassword, setShowPassword] = useState(false);
  

  

  const [formData, setFormData] = useState({
  email: "",

    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
    const handleGoogleAuth=async ()=>{
      const provider=new GoogleAuthProvider()
      const result=await signInWithPopup(auth,provider)


      try {
      const result2=await axios.post(`${serverUrl}/api/auth/googleAuth`,{  
        email:result.user.email,
      },{withCredentials:true })
      dispatch(setUserData(result2.data))
      navigate("/")
      setError("")
      
    } catch (error) {
      setError(error.response.data.message)
    }
    }
  // 📝 Submit Signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      
    };

    try {
      setLoading(true)
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        payload,
        { withCredentials: true }
      );

     dispatch(setUserData(result.data))
      setError("")
      setLoading(false)
      
    } catch (error) {
      console.log(error);
      setError(error.response.data.message)
      setLoading(false)
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h1
          className="text-3xl font-bold text-center mb-2"
          style={{ color: primaryColor }}
        >
          Swiggy
        </h1>

        <p className="text-center text-gray-500 text-sm mb-6">
          Sign in to your account to get started with delicious food deliveries
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
        

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="flex gap-2 mt-1">
              <input
                type="email"
                name="email"  
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your Email"
                className="flex-1 px-4 py-2 rounded-lg border outline-none"
                style={{ borderColor }}
                required
              />
            
            </div>
          </div>


         

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full mt-1 px-4 py-2 rounded-lg border outline-none pr-10"
                style={{ borderColor }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ?  <FaRegEyeSlash/>: <FaRegEye />}
              </button>
            </div>
          </div>
        <div className="text-right mb-4 text-[#ff4d2d] font-medium cursor-pointer" onClick={()=>navigate("/forgot-password")}>
          Forgot Password
        </div>
          

          {/* Submit */}
          <button
          disabled={loading}
            type="submit"
            className="w-full py-3 rounded-lg text-white font-semibold cursor-pointer"
            style={{ backgroundColor: primaryColor }}
          >
              {
          loading? <ClipLoader size={20} color='white'/> :"Sign In"
        }
          </button>

          {err && <p className="text-red-500 text-center my-[10]"> *{err}</p>}
              {/* Google Signup */}
<button
  type="button"
  onClick={handleGoogleAuth}
  className="w-full cursor-pointer  py-3 rounded-lg border flex items-center justify-center gap-2 font-medium"
>
  <img
    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
    alt="google"
    className="w-5 h-5"
  />
  Sign up with Google
</button>
          {/* Footer */}
          <p className="text-center text-sm mt-6">
            Dont have an account?{" "}
            <span
              className="font-medium cursor-pointer"
              style={{ color: primaryColor }}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
