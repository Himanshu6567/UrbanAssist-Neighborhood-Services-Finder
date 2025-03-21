import React, { useState } from "react";

export default function ForgotPassword() {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
  
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-5 bg-gray-100">
      <div className="bg-[#dfa674] rounded-2xl p-8 w-full max-w-md shadow-lg">
        <h2 className="text-3xl font-bold text-[#002D74] text-center">
          Forgot Password
        </h2>
        <p className="text-sm mt-2 text-[#002D74] text-center">
          Enter your details to reset your password.
        </p>

        <form
          className="flex flex-col gap-4 mt-6"
          onSubmit={handleForgotPassword}
        >
          <input
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            type="text"
            name="name"
            placeholder="Full Name"
            required
          />
          <input
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            type="email"
            name="email"
            placeholder="Email"
            required
          />
          <input
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            required
          />

          <button
            className="bg-[#002D74] text-white py-2 rounded-xl hover:scale-105 duration-300 hover:bg-[#206ab1] font-medium"
            type="submit"
          >
            Reset Password
          </button>
        </form>

        <div className="flex justify-center mt-4 text-sm">
          <a
            href="/login"
            className="text-[#002D74] font-semibold hover:underline"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
