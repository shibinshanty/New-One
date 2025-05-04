import React, { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password) {
      setErrorMessage("Email and password are required");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3006/api/users/login', { email, password });
      setMessage(response.data.message || "Login successful!");
      setErrorMessage("");

      // Save email in cookie
      Cookies.set('email', email);

      setTimeout(() => {
        navigate('/dashboard'); // Change to '/dashboard' or your desired route
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.response?.data?.message || "Invalid credentials");
      setMessage("");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 py-10">
      <div className="w-full max-w-md bg-white p-8 shadow-2xl rounded-2xl border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            type="password"
            placeholder="Password"
            ref={passwordRef}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          {errorMessage && (
            <p className="text-red-500 text-sm -mt-3">{errorMessage}</p>
          )}
          {message && (
            <p className="text-green-600 text-sm -mt-3">{message}</p>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
