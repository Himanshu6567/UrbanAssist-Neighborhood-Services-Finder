import axios from "axios";
import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../Context/MessageContext";
import { FaEyeSlash } from "react-icons/fa";

export default function Signup() {
  const navigate = useNavigate();
  const { showMessage } = useMessage();

  const [UserSignUpData, setUserSignUpData] = useState({
    // store the user details
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setshowPassword] = useState(false); // state to store the password show & hide
  const [role, setRole] = useState("");

  // input field change function
  const handleInputChange = (e) => {
    const name = e.target.name;
    setUserSignUpData((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  };

  // check if the email is valid or not
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  // vefiry the valid password
  const validatePassword = (password, confirmPassword) => {
    if (password.length < 8) {
      showMessage("Error", "Password must be at least 8 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      // alert("Passwords do not match.");
      showMessage("Error", "Passwords do not match.");
      return false;
    }
    return true;
  };

  // store the role : user/serviceProvider
  const handleUserChange = (e) => {
    setRole(e.target.value);
  };

  // signup function
  const handleSignUP = async (e) => {
    e.preventDefault();
    console.log("submit button click");
    const { name, email, mobile, password, confirmPassword } = UserSignUpData;

    if (!validateEmail(email)) {
      showMessage("Error", "Please enter a valid email address."); // if email not valid so notify
      return;
    }
    if (!validatePassword(password, confirmPassword)) {
      // password verify
      return;
    }
    if (role === "") {
      showMessage("Error", "Please select the user role.");
      return;
    }

    if (role == "serviceProvider") {
      navigate("/register", {
        state: { email, password, name, mobile, role },
      });
    }

    const userData = {
      name,
      email,
      mobile,
      password,
      role,
    };

    if (role == "user") {
      // signup for user
      try {
        const response = await axios.post(
          "http://localhost:8000/user/createNewUser",
          userData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("signup Successful:", response.data);
        if (response.status == 201) {
          navigate("/login");
        }
      } catch (err) {
        if (err.response && err.response.status == 409) {
          console.log("User already exists:", err);
          showMessage("error", "User already exists"); //message box
        } else {
          console.error("Something went wrong!", err);
          showMessage("error", "Something went wrong");
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="flex flex-col w-full max-w-3xl p-6 bg-white shadow-lg rounded-2xl md:flex-row">
        <div className="flex flex-col justify-center w-full p-4 md:w-1/2">
          <h2 className="font-bold text-3xl text-[#002D74]">Sign Up</h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to start using the service.
          </p>
          <form className="flex flex-col gap-4 mt-4" onSubmit={handleSignUP}>
            <input
              className="p-2 border rounded-md"
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleInputChange}
              required
            />
            <input
              className="p-2 border rounded-md"
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
              required
            />
            <input
              className="p-2 border rounded-md"
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              onChange={handleInputChange}
              required
            />

            <div className="relative">
              <input
                className="w-full p-2 border rounded-md"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleInputChange}
                required
              />
              <span
                onClick={() => {
                  setshowPassword(!showPassword);
                }}
                className="absolute text-gray-400 cursor-pointer top-3 right-3"
              >
                {showPassword ? <FaEyeSlash /> : <FaRegEye />}
              </span>
            </div>
            <div className="relative">
              <input
                className="w-full p-2 border rounded-md"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleInputChange}
                required
              />
              <span
                onClick={() => {
                  setshowPassword(!showPassword);
                }}
                className="absolute text-gray-400 cursor-pointer top-3 right-3"
              >
                {showPassword ? <FaEyeSlash /> : <FaRegEye />}
              </span>
            </div>
            <div className="flex space-x-5">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  onClick={handleUserChange}
                  required
                />
                <span className="ml-2">User</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="serviceProvider"
                  onClick={handleUserChange}
                />
                <span className="ml-2">Service Provider</span>
              </label>
            </div>
            <button
              className="bg-[#002D74] text-white py-2 rounded-xl hover:scale-105 transition-all duration-300 hover:bg-[#206ab1] font-medium"
              type="submit"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-sm text-center">
            Already have an account?
            <Link to={"./login"} className="text-blue-500">
              Login
            </Link>
          </p>
        </div>
        <div className="items-center justify-center hidden md:w-1/2 md:flex">
          <img
            className="max-w-full rounded-2xl"
            src="https://media.istockphoto.com/id/513439341/photo/portrait-of-enthusiastic-business-people-in-circle.jpg?s=612x612&w=0&k=20&c=oxwsq8WGFT0ixmSojntYBEZqifne4P7DlqOWbXCqWUk="
            alt="Signup form illustration"
          />
        </div>
      </div>
    </div>
  );
}
