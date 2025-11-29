// src/TodoPage/Home.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import toast from "react-hot-toast";

export default function Home({ setToken }) {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      toast.error("Please enter your feedback");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Thank you for your feedback! 💖");
      setFeedback("");
      setRating(0);
      setIsSubmitting(false);
      setShowFeedback(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <Navbar setToken={setToken} />
      
      {/* Main Content - Full Screen */}
      <div className="min-h-screen flex">
        {/* Left Side - Welcome Content */}
        <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 md:p-12 lg:p-16 xl:p-20">
          <div className="text-center max-w-4xl w-full">
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 text-white leading-tight">
              Welcome to <span className="text-cyan-400">iTask</span>
            </h1>
            
            {/* Sub Heading */}
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-8 text-gray-200">
              Your Ultimate Task Management Solution
            </h2>
            
            {/* Description */}
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-10 text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Organize your life, boost your productivity, and achieve your goals with our powerful task management system.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border-2 border-white/20 text-center">
                <div className="text-3xl mb-3">📝</div>
                <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">Easy Creation</h3>
                <p className="text-gray-300 text-sm sm:text-base">Create tasks in seconds</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border-2 border-white/20 text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">Fast Editing</h3>
                <p className="text-gray-300 text-sm sm:text-base">Update with one click</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border-2 border-white/20 text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">Smart Organization</h3>
                <p className="text-gray-300 text-sm sm:text-base">Stay focused and productive</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border-2 border-white/20 text-center">
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">Powerful Tools</h3>
                <p className="text-gray-300 text-sm sm:text-base">All features you need</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <button
                onClick={() => navigate("/todo")}
                className="cursor-pointer transition-all duration-300 px-8 sm:px-12 py-4 sm:py-6 rounded-full border-2 bg-cyan-500 text-white font-bold border-cyan-400 shadow-2xl hover:bg-cyan-600 text-xl sm:text-2xl lg:text-3xl transform hover:scale-105 w-full sm:w-auto"
              >
                🚀 Start Managing Tasks
              </button>
              
              <button
                onClick={() => setShowFeedback(true)}
                className="cursor-pointer transition-all duration-300 px-8 sm:px-12 py-4 sm:py-6 rounded-full border-2 bg-pink-500 text-white font-bold border-pink-400 shadow-2xl hover:bg-pink-600 text-xl sm:text-2xl lg:text-3xl transform hover:scale-105 w-full sm:w-auto"
              >
                💬 Give Feedback
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 flex justify-center gap-8 sm:gap-12 lg:gap-16 text-white flex-wrap">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cyan-400">1K+</div>
                <div className="text-sm sm:text-base lg:text-lg">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cyan-400">10K+</div>
                <div className="text-sm sm:text-base lg:text-lg">Tasks Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cyan-400">★ 4.9</div>
                <div className="text-sm sm:text-base lg:text-lg">User Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cyan-400">99%</div>
                <div className="text-sm sm:text-base lg:text-lg">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Visual/Image (Optional) */}
      
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
          <div className="bg-gradient-to-br from-white to-gray-100 rounded-3xl p-6 sm:p-8 md:p-10 max-w-md w-full border-2 border-gray-300 shadow-2xl">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                Share Your Feedback
              </h2>
              
              <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg">
                We value your opinion! How was your experience?
              </p>

              <form onSubmit={handleSubmitFeedback} className="space-y-4 sm:space-y-6">
                {/* Rating Stars */}
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-3xl sm:text-4xl transition-all duration-300 ${
                        star <= rating ? "text-yellow-500 scale-110" : "text-gray-300"
                      } hover:scale-110 hover:text-yellow-400`}
                    >
                      {star <= rating ? "★" : "☆"}
                    </button>
                  ))}
                </div>

                {/* Feedback Textarea */}
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What do you think about iTask? Any suggestions?"
                  className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none resize-none text-base sm:text-lg"
                  rows="4"
                />

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowFeedback(false)}
                    className="flex-1 cursor-pointer transition-all duration-300 px-6 py-3 rounded-full border-2 bg-gray-100 text-gray-700 font-semibold border-gray-400 shadow-md hover:bg-gray-200 text-lg"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 cursor-pointer transition-all duration-300 px-6 py-3 rounded-full border-2 font-semibold shadow-md text-lg ${
                      isSubmitting
                        ? "bg-gray-100 text-gray-500 border-gray-400"
                        : "bg-green-500 text-white border-green-600 hover:bg-green-600 transform hover:scale-105"
                    }`}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}