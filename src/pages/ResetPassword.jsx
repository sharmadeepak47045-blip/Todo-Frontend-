import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP & new password

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/send-verify-otp', { email });
      toast.success('OTP sent to your email ✅');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error sending OTP');
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', { email, otp, newPassword });
      toast.success('Password reset successfully ✅');
      nav('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        {step === 1 ? (
          <>
            <h2 className="text-3xl font-semibold text-white text-center mb-3">Reset Password</h2>
            <form onSubmit={sendOtp}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full mb-4 px-4 py-2 rounded bg-[#333A5C] text-white outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">Send OTP</button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-semibold text-white text-center mb-3">Enter OTP & New Password</h2>
            <form onSubmit={resetPassword}>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full mb-4 px-4 py-2 rounded bg-[#333A5C] text-white outline-none"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full mb-4 px-4 py-2 rounded bg-[#333A5C] text-white outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button type="submit" className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">Reset Password</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
