// src/TodoPage/Home.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import toast from "react-hot-toast";
import axios from "axios";

export default function Home({ setToken }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // ... validation code same ...

  try {
    setIsSubmitting(true);

    // Try MongoDB first
    const res = await axios.post("http://localhost:5000/api/feedback/create", {
      name,
      email,
      rating,
      feedback,
    });

    if (res.data.success) {
      console.log("✅ Saved to MongoDB");
      toast.success("Saved to database! ✅");
    }
    
    // ... rest of success code ...

  } catch (error) {
    console.error("MongoDB failed, saving ");
    

   
    
    
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-800">
      <Navbar setToken={setToken} />
      
      {/* Main Content - Full Screen */}
      <div className="min-h-screen flex">
        {/* Left Side - Welcome Content */}
        <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8 md:p-12 lg:p-16 xl:p-20">
          <div className="text-center max-w-4xl w-full">
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 text-white leading-tight">
              Welcome to <span className="text-yellow-400">iTask</span>
            </h1>
            
            {/* Sub Heading */}
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-8 text-gray-200">
              Your Ultimate Task Management Solution
            </h2>
            
            {/* Description */}
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-10 text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Organize your life, boost your productivity, and achieve your goals with our powerful task management system.
            </p>

            {/* Features Grid with Hover Effects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 max-w-4xl mx-auto">
              {/* Card 1 - Easy Creation */}
              <div 
                onClick={() => navigate("/todo")}
                className="group relative bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border-2 border-white/20 text-center transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-yellow-400/50 hover:shadow-2xl hover:shadow-yellow-500/20 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-500/0 rounded-2xl group-hover:from-yellow-500/10 group-hover:to-yellow-500/20 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="text-3xl mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">📝</div>
                  <h3 className="text-white font-semibold text-lg sm:text-xl mb-2 group-hover:text-yellow-300 transition-colors duration-300">Easy Creation</h3>
                  <p className="text-gray-300 text-sm sm:text-base group-hover:text-gray-200 transition-colors duration-300">Create tasks in seconds</p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-yellow-400 text-xs font-semibold">Click to try →</span>
                  </div>
                </div>
              </div>
              
              {/* Card 2 - Fast Editing */}
              <div 
                onClick={() => navigate("/todo")}
                className="group relative bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border-2 border-white/20 text-center transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-yellow-400/50 hover:shadow-2xl hover:shadow-yellow-500/20 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-500/0 rounded-2xl group-hover:from-yellow-500/10 group-hover:to-yellow-500/20 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="text-3xl mb-3 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">⚡</div>
                  <h3 className="text-white font-semibold text-lg sm:text-xl mb-2 group-hover:text-yellow-300 transition-colors duration-300">Fast Editing</h3>
                  <p className="text-gray-300 text-sm sm:text-base group-hover:text-gray-200 transition-colors duration-300">Update with one click</p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-yellow-400 text-xs font-semibold">Click to try →</span>
                  </div>
                </div>
              </div>
              
              {/* Card 3 - Smart Organization */}
              <div 
                onClick={() => navigate("/todo")}
                className="group relative bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border-2 border-white/20 text-center transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-yellow-400/50 hover:shadow-2xl hover:shadow-yellow-500/20 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-500/0 rounded-2xl group-hover:from-yellow-500/10 group-hover:to-yellow-500/20 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="text-3xl mb-3 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">🎯</div>
                  <h3 className="text-white font-semibold text-lg sm:text-xl mb-2 group-hover:text-yellow-300 transition-colors duration-300">Smart Organization</h3>
                  <p className="text-gray-300 text-sm sm:text-base group-hover:text-gray-200 transition-colors duration-300">Stay focused and productive</p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-yellow-400 text-xs font-semibold">Click to try →</span>
                  </div>
                </div>
              </div>
              
              {/* Card 4 - Powerful Tools */}
              <div 
                onClick={() => navigate("/todo")}
                className="group relative bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border-2 border-white/20 text-center transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-yellow-400/50 hover:shadow-2xl hover:shadow-yellow-500/20 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-500/0 rounded-2xl group-hover:from-yellow-500/10 group-hover:to-yellow-500/20 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="text-3xl mb-3 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300">🚀</div>
                  <h3 className="text-white font-semibold text-lg sm:text-xl mb-2 group-hover:text-yellow-300 transition-colors duration-300">Powerful Tools</h3>
                  <p className="text-gray-300 text-sm sm:text-base group-hover:text-gray-200 transition-colors duration-300">All features you need</p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-yellow-400 text-xs font-semibold">Click to try →</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <button
                onClick={() => navigate("/todo")}
                className="cursor-pointer transition-all duration-300 px-8 sm:px-12 py-4 sm:py-6 rounded-full border-2 bg-yellow-500 text-white font-bold border-yellow-400 shadow-2xl hover:bg-yellow-600 hover:scale-105 hover:shadow-yellow-500/30 text-xl sm:text-2xl lg:text-3xl transform hover:scale-105 w-full sm:w-auto"
              >
                🚀 Start Managing Tasks
              </button>
              
              <button
                onClick={() => setShowFeedback(true)}
                className="cursor-pointer transition-all duration-300 px-8 sm:px-12 py-4 sm:py-6 rounded-full border-2 bg-green-500 text-white font-bold border-green-400 shadow-2xl hover:bg-green-600 hover:scale-105 hover:shadow-green-500/30 text-xl sm:text-2xl lg:text-3xl transform hover:scale-105 w-full sm:w-auto"
              >
                💬 Give Feedback
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 flex justify-center gap-8 sm:gap-12 lg:gap-16 text-white flex-wrap">
              <div className="text-center group cursor-pointer transition-all duration-300 hover:scale-110">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">1K+</div>
                <div className="text-sm sm:text-base lg:text-lg group-hover:text-gray-200 transition-colors duration-300">Active Users</div>
              </div>
              <div className="text-center group cursor-pointer transition-all duration-300 hover:scale-110">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">10K+</div>
                <div className="text-sm sm:text-base lg:text-lg group-hover:text-gray-200 transition-colors duration-300">Tasks Created</div>
              </div>
              <div className="text-center group cursor-pointer transition-all duration-300 hover:scale-110">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">★ 4.9</div>
                <div className="text-sm sm:text-base lg:text-lg group-hover:text-gray-200 transition-colors duration-300">User Rating</div>
              </div>
              <div className="text-center group cursor-pointer transition-all duration-300 hover:scale-110">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">99%</div>
                <div className="text-sm sm:text-base lg:text-lg group-hover:text-gray-200 transition-colors duration-300">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
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

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Name Input */}
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-base sm:text-lg transition-colors duration-300 hover:border-blue-400"
                    required
                  />
                </div>

                {/* Email Input */}
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                    className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-base sm:text-lg transition-colors duration-300 hover:border-blue-400"
                    required
                  />
                </div>

                {/* Rating Stars */}
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-3xl sm:text-4xl transition-all duration-300 hover:scale-125 ${
                        star <= rating ? "text-yellow-500 scale-110" : "text-gray-300 hover:text-yellow-400"
                      }`}
                    >
                      {star <= rating ? "★" : "☆"}
                    </button>
                  ))}
                </div>
                <div className="text-center text-sm text-gray-500">
                  {rating === 0 ? "Select a rating" : `Selected: ${rating} star${rating > 1 ? 's' : ''}`}
                </div>

                {/* Feedback Textarea */}
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What do you think about iTask? Any suggestions?"
                  className="w-full px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none resize-none text-base sm:text-lg transition-colors duration-300 hover:border-blue-400"
                  rows="4"
                  required
                />

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFeedback(false);
                      setName("");
                      setEmail("");
                      setFeedback("");
                      setRating(0);
                    }}
                    className="flex-1 cursor-pointer transition-all duration-300 px-6 py-3 rounded-full border-2 bg-gray-100 text-gray-700 font-semibold border-gray-400 shadow-md hover:bg-gray-200 hover:scale-105 text-lg"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 cursor-pointer transition-all duration-300 px-6 py-3 rounded-full border-2 font-semibold shadow-md text-lg ${
                      isSubmitting
                        ? "bg-gray-100 text-gray-500 border-gray-400 cursor-not-allowed"
                        : "bg-green-500 text-white border-green-600 hover:bg-green-600 hover:scale-105 hover:shadow-green-500/30"
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