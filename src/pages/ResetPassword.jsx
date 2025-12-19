import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaEnvelope, FaKey, FaUnlockAlt, FaArrowLeft } from 'react-icons/fa';

const ResetPassword = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  
  
    const API = import.meta.env.VITE_API_BASE_URL;


  const sendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
await axios.post(`${API}/auth/send-reset-otp`, { email });
      toast.success('OTP sent to your email ✅');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error sending OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
await axios.post(`${API}/auth/reset-password`, {
  email,
  otp,
  newPassword
});      
      toast.success('Password reset successfully ✅');
      nav('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error resetting password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-teal-900 to-cyan-900 p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => nav(-1)}
          className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 group transition-all"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        {/* Main Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-teal-500/30 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/30 mb-4">
              <FaUnlockAlt className="text-3xl text-teal-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {step === 1 ? 'Reset Your Password' : 'Create New Password'}
            </h2>
            <p className="text-gray-400 text-sm">
              {step === 1 
                ? 'Enter your email to receive a verification code' 
                : 'Enter the OTP and your new password'}
            </p>
          </div>

          {/* Step 1: Email Input */}
          {step === 1 ? (
            <form onSubmit={sendOtp} className="space-y-6">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400 group-focus-within:text-teal-300">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-700/50 border border-teal-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 rounded-xl font-semibold transition-all ${
                  isLoading
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white hover:shadow-lg hover:shadow-teal-500/20'
                }`}
              >
                {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
              </button>
            </form>
          ) : (
            /* Step 2: OTP and New Password */
            <form onSubmit={resetPassword} className="space-y-6">
              {/* OTP Input */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400 group-focus-within:text-teal-300">
                  <span className="font-bold">🔢</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-700/50 border border-teal-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  required
                />
              </div>

              {/* New Password Input */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-400 group-focus-within:text-teal-300">
                  <FaKey />
                </div>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-700/50 border border-teal-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength="6"
                  required
                />
              </div>

              {/* Password Requirements */}
              <div className="text-xs text-gray-400 space-y-1">
                <p className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-600'}`}></span>
                  At least 6 characters
                </p>
                <p className="text-gray-500 text-xs italic">
                  Check your email for the verification code
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3.5 rounded-xl font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-all"
                >
                  Back
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 py-3.5 rounded-xl font-semibold transition-all ${
                    isLoading
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white hover:shadow-lg hover:shadow-emerald-500/20'
                  }`}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          )}

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-700/50">
            <p className="text-center text-gray-400 text-sm">
              Remember your password?{' '}
              <button
                onClick={() => nav('/login')}
                className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-xs">
            Need help? Contact our support team
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;