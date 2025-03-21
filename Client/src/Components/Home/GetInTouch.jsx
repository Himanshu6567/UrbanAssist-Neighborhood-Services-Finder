

import axios from "axios";
import React, { useState } from "react";
import { useMessage } from "../Context/MessageContext";

const GetInTouch = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const [btnText, setBtnText] = useState("Submit");

  const { showMessage } = useMessage();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  // submit mgs & query.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnText("Submitting...");
    try {
      const response = await axios.post(
        "http://localhost:8000/sendMessage",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status == 201) {
        console.log(response.status);
        showMessage("success", "message  send successfully");

        setFormData({ fullName: "", email: "", message: "" });
      }
    } catch (err) {
      showMessage("Error", "enable to send message");
      console.log("enable to send message", err);
    } finally {
      setBtnText("Submit");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-white lg:flex-row bg-gradient-to-r from-gray-800 to-gray-900">
      {/* Left Side - Form */}
      <div className="w-full p-6 bg-gray-700 rounded-lg shadow-lg lg:w-1/2">
        <h1 className="mb-6 text-4xl font-bold text-center">Get in Touch!</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="flex flex-wrap gap-4">
            <input
              required
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="flex-grow p-3 text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <input
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email Address"
            className="w-full p-3 text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
          />

          {/* Message */}
          <textarea
            required
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows="4"
            placeholder="Message"
            className="w-full p-3 text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
          ></textarea>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 font-semibold text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            {btnText}
          </button>
        </form>
      </div>

      {/* Right Side - Image */}
      <div className="flex items-center justify-center w-full mt-6 lg:w-1/2 lg:mt-0">
        <img
          src="https://cdn.pixabay.com/photo/2012/03/01/01/42/hands-20333_1280.jpg"
          alt="Contact Us"
          className="w-full max-w-xs rounded-lg shadow-lg lg:max-w-sm xl:max-w-md"
        />
      </div>
    </div>
  );
};

export default GetInTouch;
