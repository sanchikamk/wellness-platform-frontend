import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axiosInstance";
import { API_ENDPOINTS } from "../config/config";
import { useToast } from "../context/ToastContext";

const AuthPage = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
    specialization: "mental health",
    experience: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuthValues } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (activeTab === "login") {
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.password) newErrors.password = "Password is required";
    } else {
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
      if (formData.role === "counselor") {
        if (!formData.specialization) newErrors.specialization = "Specialization is required";
        if (!formData.experience) newErrors.experience = "Experience is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validateForm()) return;

    setLoading(true);

    try {
      const endpoint = activeTab === "login" ? API_ENDPOINTS.LOGIN : API_ENDPOINTS.REGISTER;
      const payload = activeTab === "login" ? { email: formData.email, password: formData.password } : formData;

      const response = await axios.post(endpoint, payload);

      setAuthValues({
        token: response.data.token,
        user: response.data.user,
      });

      addToast("Login successful! Welcome back.", "success");
      navigate(response.data.user.role === "client" ? "/client" : "/counselor");
    } catch (error) {
      addToast(error.response?.data?.msg || "Something went wrong. Please try again.", "error");
      setApiError(error.response?.data?.msg || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex overflow-auto">
      {/* Left Side - Platform Info */}
      <div className="hidden md:flex w-1/2 bg-slate-900 p-12 flex-col justify-center items-center text-white">
        <div className="w-full max-w-md mb-16">
          {" "}
          {/* Added max-w-md and w-full */}
          <div className="flex items-center mb-8">
            <svg className="w-10 h-10 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.1 21.35l-1.1-1.02C5.14 15.14 2 12.26 2 8.5 
       2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 
       C13.09 3.81 14.76 3 16.5 3 
       19.58 3 22 5.42 22 8.5 
       c0 3.76-3.14 6.64-9 11.83l-0.9 0.82z"
                fill="white"
              />
              <path d="M6.5 10h2l1.2-3.5 2.3 6 1.5-3.5h2.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <h1 className="text-4xl font-bold">Wellness Platform</h1>
          </div>
          <ul className="space-y-6 text-lg">
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-4" viewBox="0 0 24 24" fill="white">
                <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
              </svg>
              Secure and confidential sessions
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-4" viewBox="0 0 24 24" fill="white">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
              </svg>
              Connect with certified therapists
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-4" viewBox="0 0 24 24" fill="white">
                <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1" />
              </svg>
              Flexible scheduling options
            </li>
          </ul>
        </div>

        <div className="w-full max-w-md">
          {" "}
          {/* Added max-w-md and w-full */}
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 overflow-hidden">
              <svg className="w-full h-full text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
              </svg>
            </div>
            <div>
              <p className="text-xl mb-1 font-semibold">"Life-changing platform"</p>
              <p className="text-gray-400">Sarah M. - Platform User</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Tab Navigation */}
          <div className="bg-gray-100 rounded-xl flex p-1 w-full max-w-xs mx-auto mb-8">
            <button className={`w-1/2 py-2 font-semibold text-center transition-all duration-200 ${activeTab === "login" ? "bg-white text-slate-900 rounded-l-xl shadow" : "text-gray-500 hover:text-gray-700 !bg-[unset]"}`} onClick={() => setActiveTab("login")}>
              Login
            </button>
            <button className={`w-1/2 py-2 font-semibold text-center transition-all duration-200 ${activeTab === "register" ? "bg-white text-slate-900 rounded-r-xl shadow" : "text-gray-500 hover:text-gray-700 !bg-[unset]"} outline-none border-none ring-0 ring-transparent focus:outline-none focus:ring-0 focus:ring-transparent focus:border-none`} onClick={() => setActiveTab("register")}>
              Register
            </button>
          </div>

          {/* {apiError && <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-md">{apiError}</div>} */}

          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === "register" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                      </svg>
                    </span>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter your name" />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                      </svg>
                    </span>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter your email" />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
                      </svg>
                    </span>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter your password" />
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="client">Client</option>
                    <option value="counselor">Counselor</option>
                  </select>
                </div>

                {formData.role === "counselor" && (
                  <>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                      <select name="specialization" value={formData.specialization} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="mental health">Mental Health</option>
                        <option value="relationship advice">Relationship</option>
                        <option value="career counseling">Career</option>
                      </select>
                      {errors.specialization && <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>}
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                      <input type="number" name="experience" min="0" value={formData.experience} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Years of experience" />
                      {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "login" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                      </svg>
                    </span>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter your email" />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    {/* Left icon */}
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
                      </svg>
                    </span>

                    {/* Right toggle icon */}
                    <span onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-500">
                      {showPassword ? (
                        // Eye OFF icon
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M2,5.27L3.28,4L20,20.72L18.73,22L15.73,19C14.45,19.63 13.27,20 12,20C7,20 2.73,16.89 1,12.5C1.66,10.77 2.69,9.23 4,8L2,5.27M12,6C16.97,6 21.24,9.11 23,13.5C22.34,15.23 21.31,16.77 20,18L17.74,15.74C17.91,15.17 18,14.6 18,14C18,11.24 15.76,9 13,9C12.4,9 11.83,9.09 11.26,9.26L9.28,7.28C10.11,6.9 11.04,6.66 12,6Z" />
                        </svg>
                      ) : (
                        // Eye ON icon
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                        </svg>
                      )}
                    </span>

                    {/* Input */}
                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter your password" />
                  </div>

                  {/* Error */}
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center cursor-pointer">
                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer" />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-3 px-4 rounded-md !bg-slate-900 hover:bg-slate-900 focus:outline-none  disabled:opacity-50 flex items-center justify-center">
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  {activeTab === "login" ? "Login" : "Register"}
                  <svg className="ml-2 w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          {/* Social login divider */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" />
              </svg>
            </button>
            <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
              </svg>
            </button>
            <button type="button" className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
              </svg>
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            {activeTab === "login" ? (
              <>
                Don't have an account?{" "}
                <button onClick={() => setActiveTab("register")} className="font-medium text-indigo-600 hover:text-indigo-500">
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => setActiveTab("login")} className="font-medium text-indigo-600 hover:text-indigo-500">
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
