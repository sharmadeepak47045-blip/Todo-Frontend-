// src/TodoPage/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import toast from "react-hot-toast";
import axios from "axios";
import { FaStar, FaRocket, FaTasks, FaEdit, FaBolt, FaLightbulb, FaChartLine, FaHeart, FaUsers, FaCheckCircle } from "react-icons/fa";

export default function Home({ setToken }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setName(savedUser.name || "");
      setEmail(savedUser.email || "");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating!");
      return;
    }

    if (!feedback.trim()) {
      toast.error("Please enter your feedback!");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await axios.post(
        `${API_BASE_URL}/feedback/create`,
        {
          name,
          email,
          rating,
          feedback: feedback.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        toast.success("Thank you for your feedback! ✅");
        setFeedback("");
        setRating(0);
        setShowFeedback(false);
        console.log("✅ Feedback saved successfully");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      
      if (error.response) {
        toast.error(`Server Error: ${error.response.data.message || "Failed to save feedback"}`);
      } else if (error.request) {
        toast.error("Network Error: Cannot connect to server");
      } else {
        toast.error("Error: " + error.message);
      }
      
      setFeedback("");
      setRating(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowFeedback(false);
    setFeedback("");
    setRating(0);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-cyan-900">
      <Navbar setToken={setToken} />
      
      {/* Main Content */}
      <div className="min-h-screen flex">
        {/* Welcome Content */}
        <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 md:p-12 lg:p-16">
          <div className="text-center max-w-6xl w-full">
            {/* Main Heading */}
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-teal-200 to-cyan-200 bg-clip-text text-transparent">
                Welcome to <span className="text-teal-400">TaskMaster</span>
              </h1>
              
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-gray-300">
                Your Ultimate Task Management Solution
              </h2>
              
              <p className="text-lg sm:text-xl md:text-2xl mb-10 text-gray-400 leading-relaxed max-w-3xl mx-auto">
                Organize your life, boost productivity, and achieve your goals with our powerful task management system.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 max-w-5xl mx-auto">
              {/* Card 1 */}
              <div 
                onClick={() => navigate("/todo")}
                className="group relative bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-teal-500/30 text-center transition-all duration-300 hover:scale-105 hover:bg-teal-900/30 hover:border-teal-400/50 hover:shadow-xl hover:shadow-teal-500/10 cursor-pointer"
              >
                <div className="relative z-10">
                  <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FaTasks className="text-2xl text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-teal-300 transition-colors">Easy Creation</h3>
                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Create tasks in seconds</p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-teal-400 text-xs font-semibold">Click to try →</span>
                  </div>
                </div>
              </div>
              
              {/* Card 2 */}
              <div 
                onClick={() => navigate("/todo")}
                className="group relative bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-teal-500/30 text-center transition-all duration-300 hover:scale-105 hover:bg-teal-900/30 hover:border-teal-400/50 hover:shadow-xl hover:shadow-teal-500/10 cursor-pointer"
              >
                <div className="relative z-10">
                  <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FaBolt className="text-2xl text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-teal-300 transition-colors">Fast Editing</h3>
                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Update with one click</p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-teal-400 text-xs font-semibold">Click to try →</span>
                  </div>
                </div>
              </div>
              
              {/* Card 3 */}
              <div 
                onClick={() => navigate("/todo")}
                className="group relative bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-teal-500/30 text-center transition-all duration-300 hover:scale-105 hover:bg-teal-900/30 hover:border-teal-400/50 hover:shadow-xl hover:shadow-teal-500/10 cursor-pointer"
              >
                <div className="relative z-10">
                  <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FaLightbulb className="text-2xl text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-teal-300 transition-colors">Smart Organization</h3>
                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Stay focused and productive</p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-teal-400 text-xs font-semibold">Click to try →</span>
                  </div>
                </div>
              </div>
              
              {/* Card 4 */}
              <div 
                onClick={() => navigate("/todo")}
                className="group relative bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-teal-500/30 text-center transition-all duration-300 hover:scale-105 hover:bg-teal-900/30 hover:border-teal-400/50 hover:shadow-xl hover:shadow-teal-500/10 cursor-pointer"
              >
                <div className="relative z-10">
                  <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FaRocket className="text-2xl text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-teal-300 transition-colors">Powerful Tools</h3>
                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">All features you need</p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-teal-400 text-xs font-semibold">Click to try →</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12">
              <button
                onClick={() => navigate("/todo")}
                className="group flex items-center gap-3 cursor-pointer transition-all duration-300 px-8 py-4 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold shadow-lg hover:from-teal-500 hover:to-cyan-500 hover:scale-105 hover:shadow-teal-500/30 text-lg sm:text-xl"
              >
                <FaRocket className="group-hover:rotate-12 transition-transform" />
                Start Managing Tasks
              </button>
              
              <button
                onClick={() => setShowFeedback(true)}
                className="group flex items-center gap-3 cursor-pointer transition-all duration-300 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold shadow-lg hover:from-emerald-500 hover:to-green-500 hover:scale-105 hover:shadow-emerald-500/30 text-lg sm:text-xl"
              >
                <FaStar className="group-hover:scale-125 transition-transform" />
                Give Feedback
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-4 rounded-xl bg-gray-800/40 backdrop-blur-sm border border-teal-500/30 hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="text-3xl font-bold text-teal-400 mb-2">1K+</div>
                <div className="text-gray-300 text-sm">Active Users</div>
                <FaUsers className="mx-auto mt-2 text-teal-500/50" />
              </div>
              
              <div className="text-center p-4 rounded-xl bg-gray-800/40 backdrop-blur-sm border border-teal-500/30 hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="text-3xl font-bold text-teal-400 mb-2">10K+</div>
                <div className="text-gray-300 text-sm">Tasks Created</div>
                <FaTasks className="mx-auto mt-2 text-teal-500/50" />
              </div>
              
              <div className="text-center p-4 rounded-xl bg-gray-800/40 backdrop-blur-sm border border-teal-500/30 hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="text-3xl font-bold text-teal-400 mb-2">★ 4.9</div>
                <div className="text-gray-300 text-sm">User Rating</div>
                <FaChartLine className="mx-auto mt-2 text-teal-500/50" />
              </div>
              
              <div className="text-center p-4 rounded-xl bg-gray-800/40 backdrop-blur-sm border border-teal-500/30 hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="text-3xl font-bold text-teal-400 mb-2">99%</div>
                <div className="text-gray-300 text-sm">Satisfaction</div>
                <FaHeart className="mx-auto mt-2 text-teal-500/50" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 sm:p-8 max-w-md w-full border border-teal-500/30 shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-full bg-teal-500/20 mb-4 border border-teal-500/30">
                <FaStar className="text-2xl text-teal-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-white">
                Share Your Feedback
              </h2>
              
              <p className="text-gray-400 text-sm">
                We value your opinion! How was your experience?
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div>
                <input
                  type="text"
                  value={name}
                  disabled
                  placeholder="Your Name"
                  className="w-full bg-gray-700/50 px-4 py-3 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 cursor-not-allowed"
                  required
                />
              </div>

              {/* Email Input */}
              <div>
                <input
                  type="email"
                  value={email}
                  disabled
                  placeholder="Your Email"
                  className="w-full bg-gray-700/50 px-4 py-3 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 cursor-not-allowed"
                  required
                />
              </div>

              {/* Rating Stars */}
              <div className="text-center">
                <div className="flex justify-center space-x-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-all duration-300 hover:scale-110 ${
                        star <= rating ? "text-yellow-500" : "text-gray-500 hover:text-yellow-400"
                      }`}
                    >
                      {star <= rating ? "★" : "☆"}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-gray-400">
                  {rating === 0 ? "Select a rating" : `${rating} star${rating > 1 ? 's' : ''} selected`}
                </div>
              </div>

              {/* Feedback Textarea */}
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What do you think about TaskMaster? Any suggestions?"
                className="w-full px-4 py-3 border border-gray-600/50 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:border-teal-500 focus:outline-none resize-none transition-colors"
                rows="3"
                required
              />

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 cursor-pointer transition-all duration-300 px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 cursor-pointer transition-all duration-300 px-4 py-3 rounded-lg font-semibold ${
                    isSubmitting
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:opacity-90"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}