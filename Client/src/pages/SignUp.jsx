import React, { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState('');

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const name = nameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();
  
    if (!name || !email || !password) {
      setErrorMessage("All fields are required.");
      return;
    }
  
    if (!validatePassword(password)) {
      setErrorMessage("Password must be at least 8 characters long, with uppercase, lowercase, number, and a special character.");
      return;
    }
  
    setErrorMessage("");
  
    const formData = { name, email, password };
  
    try {
      const response = await axios.post('http://localhost:3006/api/users/signup', formData);
      setMessage(response.data.message);
      setErrorMessage("");
      Cookies.set('email', formData.email); // make sure cookie is set
      setTimeout(() => {
        navigate('/otp');
      }, 1500);
    } catch (error) {
      console.error("Signup error:", error.response?.data);
      setErrorMessage(error.response?.data?.message || "Something went wrong");
      setMessage('');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 py-10">
      <div className="w-full max-w-md bg-white p-8 shadow-2xl rounded-2xl border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" placeholder="Name"ref={nameRef}className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"/>
          <input type="email" placeholder="Email"ref={emailRef} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"/>
          <input type="password" placeholder="Password" ref={passwordRef} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"/>
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
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
