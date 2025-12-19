import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { auth, googleProvider } from "../firebase.jsx";
import { signInWithPopup } from "firebase/auth";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaTasks } from "react-icons/fa";

const Login = ({ setToken }) => {
  const nav = useNavigate();
  const API = import.meta.env.VITE_API_BASE_URL;

  const [state, setState] = useState("Login"); // Default to Login
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state === "Signup") setFormData({ name: "", email: "", password: "" });
  }, [state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      const res = await axios.post(`${API}/auth/google`, { idToken });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role);
      
      if (setToken) setToken(res.data.token);
      
      toast.success("Google login successful ✅");
      
      if (res.data.user.role === "admin") window.location.href = "/admin";
      else window.location.href = "/home";
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Google login failed");
    }
  };

  const handleForgotPassword = () => nav("/reset-password");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (state === "Signup") {
      if (!formData.name.trim()) return toast.error("Name is required") & setLoading(false);
      if (!/^[A-Za-z\s]+$/.test(formData.name)) return toast.error("Name should contain only alphabets") & setLoading(false);
      if (formData.name.trim().length < 3) return toast.error("Name must be at least 3 characters") & setLoading(false);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return toast.error("Enter a valid email address") & setLoading(false);
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) return toast.error("Password must be at least 8 characters with uppercase, lowercase, number & special character") & setLoading(false);

      try {
        await axios.post(`${API}/auth/signup`, formData);
        toast.success("Account created successfully! ✅");
        setState("Login");
        setFormData({ name: "", email: "", password: "" });
      } catch (err) {
        toast.error(err.response?.data?.message || "Signup failed");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res = await axios.post(`${API}/auth/login`, {
          email: formData.email,
          password: formData.password
        });

        if (res.data.token) {
          toast.success("Login successful! ✅");
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("role", res.data.user?.role);
          setToken(res.data.token);

          setTimeout(() => {
            if (res.data.user?.role === "admin") window.location.href = "/admin";
            else nav("/home", { replace: true });
          }, 500);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Login failed");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-teal-900 to-cyan-900 p-4">
      <div className="w-full max-w-md">
      

        {/* Main Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-teal-500/30 shadow-2xl">
          {/* Form Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {state === "Signup" ? "Create Your Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-400 text-sm">
              {state === "Signup" 
                ? "Get started with your free account" 
                : "Sign in to continue to your dashboard"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {state === "Signup" && (
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400">
                  <FaUser />
                </div>
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-teal-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
              </div>
            )}

            <div className="relative group">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400">
                <FaEnvelope />
              </div>
              <input 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                type="email" 
                placeholder="Email Address" 
                className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-teal-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400">
                <FaLock />
              </div>
              <input 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                className="w-full pl-12 pr-12 py-3 bg-gray-700/50 border border-teal-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-300"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {state === "Login" && (
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input type="checkbox" id="remember" className="w-4 h-4 text-teal-600 bg-gray-700 border-teal-500 rounded focus:ring-teal-500" />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-400">Remember me</label>
                </div>
                <button 
                  type="button" 
                  onClick={handleForgotPassword} 
                  className="text-sm text-teal-400 hover:text-teal-300 hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold transition-all bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white hover:shadow-lg hover:shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {state === "Signup" ? "Creating Account..." : "Signing In..."}
                </>
              ) : (
                state === "Signup" ? "Create Account" : "Sign In"
              )}
            </button>
          </form>

          {state === "Login" && (
            <>
              <div className="flex items-center my-6">
                <div className="flex-grow h-px bg-gray-700" />
                <span className="px-4 text-sm text-gray-400">Or continue with</span>
                <div className="flex-grow h-px bg-gray-700" />
              </div>
              <button 
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-3 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-xl border border-gray-300 transition-all duration-300"
              >
                <FaGoogle className="text-red-500" />
                Continue with Google
              </button>
            </>
          )}

          <div className="mt-8 pt-6 border-t border-gray-700/50 text-center">
            <p className="text-gray-400 text-sm mb-2">
              {state === "Signup" ? "Already have an account?" : "Don't have an account?"}
            </p>
            <button 
              onClick={() => setState(state === "Signup" ? "Login" : "Signup")} 
              className="text-teal-400 hover:text-teal-300 font-medium text-sm px-4 py-2 rounded-lg hover:bg-teal-500/10 transition-all"
            >
              {state === "Signup" ? "Sign in instead" : "Create new account"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-xs">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;