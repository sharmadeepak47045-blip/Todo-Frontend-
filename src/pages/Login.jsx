import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Login = ({ setToken }) => {
  const nav = useNavigate();

  // ✅ Environment variable use karein
  const API = import.meta.env.VITE_API_BASE_URL;

  const [state, setState] = useState("Signup");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state === "Signup") {
      setFormData({ name: "", email: "", password: "" });
    }
  }, [state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (state === "Signup") {
      // Signup validation
      if (!formData.name.trim()) {
        toast.error("Name is required");
        setLoading(false);
        return;
      }
      if (formData.name.trim().length < 3) {
        toast.error("Name must be at least 3 characters");
        setLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Enter a valid email address");
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
      if (!strongPassword.test(formData.password)) {
        toast.error("Password must contain uppercase, lowercase, number & special character");
        setLoading(false);
        return;
      }

      try {
        // ✅ Environment variable use karein
        const response = await axios.post(`${API}/auth/signup`, formData);
        toast.success("Signup Success ✅");
        
        // Switch to login after signup
        setState("Login");
        setFormData({ name: "", email: "", password: "" });
      } catch (err) {
        toast.error(err.response?.data?.message || "Signup failed");
      } finally {
        setLoading(false);
      }
    } else {
      // Login
      try {
        // ✅ Environment variable use karein
        const res = await axios.post(
          `${API}/auth/login`,
          {
            email: formData.email,
            password: formData.password
          }
        );
        
        // ✅ Check for token instead of success
        if (res.data.token) {
          toast.success("Login Success ✅");

          // ✅ Save token to localStorage & App state
          localStorage.setItem("token", res.data.token);
          setToken(res.data.token);

          // ✅ Direct navigation
          nav("/home", { replace: true });
        } else {
          toast.error(res.data.message || "Login failed - No token received");
        }
      } catch (err) {
        console.error("Login error:", err);
        toast.error(err.response?.data?.message || "Login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => nav("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Signup" ? "Create account" : "Login account!"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Signup" ? "Create your account" : "Login your account!"}
        </p>

        <form onSubmit={handleSubmit}>
          {state === "Signup" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input
                onChange={handleChange}
                name="name"
                value={formData.name}
                type="text"
                placeholder="Full Name"
                autoComplete="off"
                required
                className="text-white placeholder-white outline-none w-full bg-transparent"
                disabled={loading}
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              name="email"
              onChange={handleChange}
              value={formData.email}
              type="email"
              placeholder="Email21@gmail.com"
              autoComplete="off"
              required
              className="text-white placeholder-white outline-none w-full bg-transparent"
              disabled={loading}
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={handleChange}
              value={formData.password}
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="off"
              required
              className="text-white placeholder-white outline-none w-full bg-transparent"
              disabled={loading}
            />
          </div>

          <p
            onClick={() => !loading && nav("/reset-Password")}
            className={`mb-4 cursor-pointer ${loading ? 'text-gray-500' : 'text-indigo-500'}`}
          >
            Forgot Password?
          </p>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-full text-white font-medium ${
              loading 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-500 to-indigo-900'
            }`}
          >
            {loading ? "Processing..." : state}
          </button>
        </form>

        {state === "Signup" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account?{" "}
            <span
              onClick={() => !loading && setState("Login")}
              className={`cursor-pointer ${loading ? 'text-gray-500' : 'text-blue-400 underline'}`}
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't have an account?{" "}
            <span
              onClick={() => !loading && setState("Signup")}
              className={`cursor-pointer ${loading ? 'text-gray-500' : 'text-blue-400 underline'}`}
            >
              Sign up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;