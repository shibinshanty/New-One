import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';  // Import js-cookie

const OTPPage = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const otpRef = useRef();
  const navigate = useNavigate();

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otpRef.current.value;
  
    const email = Cookies.get('email');
    console.log("Retrieved email from cookie:", email);  // Log email
  
    if (!email) {
      setErrorMessage('Email not found in cookies. Please register again.');
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:3006/api/users/verifyotp',
        {
          otp: enteredOtp,
          email: email
        }
      );
  
      if (response?.data?.message === "User Registered Successfully!") {
        setMessage(response.data.message);
        setErrorMessage('');
  
        // Optional: clear the cookie after successful verification
        Cookies.remove('email');
  
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setErrorMessage('OTP verification failed.');
        setMessage('');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setErrorMessage(error.response?.data?.message || 'Something went wrong');
      setMessage('');
    }
  };
  
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-6">Verify OTP</h2>
        <form onSubmit={handleOtpSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            ref={otpRef}
            maxLength="6"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          {message && (
            <p className="text-green-600 text-sm">{message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white font-semibold py-3 rounded-lg hover:brightness-110 transition-all duration-300"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPPage;
