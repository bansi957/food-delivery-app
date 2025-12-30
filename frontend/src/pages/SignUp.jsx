import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import {ClipLoader} from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/UserSlice";

function SignUp() {
  const dispatch=useDispatch()
  const primaryColor = "#ff4d2d";
  const bgColor = "#fff9f6";
  const borderColor = "#e5e5e5";
  const [loading,setLoading]=useState(false)
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loadingOtp, setLoadingOtp] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [err,setError]=useState("")
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 📩 Send OTP
  const handleSendOtp = async () => {
    setLoadingOtp(true);
    if (!formData.email) {
      setError("Please enter email first")
      return;
    }

    try {
      await axios.post(
        `${serverUrl}/api/auth/otp`,
        { email: formData.email },
        { withCredentials: true }
      );

      setOtpSent(true);
      setError("")
    } catch (error) {
      setError(error.response.data.message)
    } finally {
      setLoadingOtp(false);
    }
  };

  // 📝 Submit Signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otpSent || !otp) {
     setError("otp is required to SignUp")
      return;
    }

    const payload = {
      ...formData,
      role,
      otp,
    };

    try {
      setLoading(true)
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        payload,
        { withCredentials: true }
      );

      dispatch(setUserData(result.data))
      setError("")
      setLoading(false)
   
    } catch (error) {
      setError(error.response.data.message)
      setLoading(false)
    }
  };

  const handleGoogleAuth=async ()=>{
    if(!formData.mobile){
      return setError("mobile number is required")
    }
    const provider=new GoogleAuthProvider()
    let result=await signInWithPopup(auth,provider)
    console.log(result)

    try {
       const result2=await axios.post(`${serverUrl}/api/auth/googleAuth`,{
        fullName:result.user.displayName,
        email:result.user.email,
        role,
        mobile:formData.mobile

      },{withCredentials:true })
     
      dispatch(setUserData(result2.data))
      navigate("/")
      setError("")
    
    } catch (error) {
     setError(error.response.data.message)
    }
  }

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
          Create your account to get started with delicious food deliveries
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your Full Name"
              className="w-full mt-1 px-4 py-2 rounded-lg border outline-none"
              style={{ borderColor }}
              required
            />
          </div>

          {/* Email + OTP Button */}
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
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpSent || loadingOtp}
                className="px-4 rounded-lg text-white text-sm font-medium"
                style={{
                  backgroundColor: otpSent ? "#ccc" : primaryColor,
                }}
              >
                {loadingOtp ?<ClipLoader size={20} color='white'/> : otpSent ? "OTP Sent" : "Send OTP"}
              </button>
            </div>
          </div>

          {/* OTP Input */}
          {otpSent && (
            <div>
              <label className="text-sm font-medium">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full mt-1 px-4 py-2 rounded-lg border outline-none"
                style={{ borderColor }}
                required
              />
            </div>
          )}

          {/* Mobile */}
          <div>
            <label className="text-sm font-medium">Mobile</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter your Mobile Number"
              className="w-full mt-1 px-4 py-2 rounded-lg border outline-none"
              style={{ borderColor }}
              required
            />
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
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ?  <FaRegEyeSlash/>: <FaRegEye />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-medium">Role</label>
            <div className="flex gap-3 mt-2">
              {["user", "owner", "deliveryBoy"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRole(item)}
                  className="flex-1 py-2 rounded-lg font-medium border"
                  style={{
                    backgroundColor:
                      role === item ? primaryColor : "white",
                    color: role === item ? "white" : "#666",
                    borderColor,
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
          disabled={loading}
            type="submit"
            className="w-full py-3 rounded-lg text-white font-semibold cursor-pointer"
            style={{ backgroundColor: primaryColor }}
          >
          
        {
          loading?<ClipLoader size={20} color='white'/> :"Sign Up"
        }
          </button>

          {err && <p className="text-red-500 text-center my-[10]"> *{err}</p>}
              {/* Google Signup */}
<button
  type="button"
  onClick={handleGoogleAuth}
  className="cursor-pointer w-full  py-3 rounded-lg border flex items-center justify-center gap-2 font-medium"
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
            Already have an account?{" "}
            <span
              className="font-medium cursor-pointer"
              style={{ color: primaryColor }}
              onClick={() => navigate("/signin")}
            >
              Sign In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
