import axios from "axios";
import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useMessage } from "../Context/MessageContext";
import { FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [error, setError] = useState(""); // store state of error
  const [userDetails, setUserDetails] = useState({
    // store user details
    email: "",
    password: "",
    role: "",
  });

  const [showPassword, setshowPassword] = useState(false); //state to store password hide & show
  const navigate = useNavigate();
  const { showMessage } = useMessage(); // for notify

  // input field change function
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  // login function
  const handleLogIn = async (e) => {
    e.preventDefault();
    const { role } = userDetails;
    if (!role) {
      setError("All fields are required");
      return;
    }

    if (role == "user") {
      // for user login
      try {
        const response = await axios.post(
          "http://localhost:8000/user/loginUser",
          userDetails,

          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("res is", response.status);
        if (response.status == 201) {
          console.log("Login Successful:", response.data);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("role", response.data.role);
          localStorage.setItem("Userid", response.data.useID);

          showMessage("success", "Login Successful"); //notify
          navigate("/"); // if verify then navigate to the home page
        }
      } catch (err) {
        console.error("Invalid credentials or something went wrong!", err);
        if (err.response && err.response.status == 401) {
          console.log("Invalid Email or Password:", err.response.data);
          showMessage("error", "Invalid email or password"); //message box
        } else {
          console.error("Something went wrong!", err);
          showMessage("error", "Something went wrong");
        }
      }
    }

    if (role == "serviceProvider") {
      // for servoce provider login
      try {
        const response = await axios.post(
          "http://localhost:8000/serviceProvider/logInServiceProvider",
          userDetails,

          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status == 201) {
          console.log("Login Successful:", response.data);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("role", response.data.role);
          showMessage("success", "Login Successful");
          navigate("/"); //if verify then navigate to the home page
        }
      } catch (err) {
        if (err.response && err.response.status == 401) {
          console.log("Invalid Email or Password:", err.response.data);
          showMessage("error", "Invalid email or password"); //message box
        } else {
          console.error("Something went wrong!", err);
          showMessage("error", "Something went wrong");
        }
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="bg-[#dfa674] rounded-2xl flex flex-col md:flex-row max-w-3xl w-full p-6 items-center shadow-lg">
        <div className="px-8 md:w-1/2">
          <h2 className="font-bold text-3xl text-[#002D74]">Login</h2>
          <p className="text-sm mt-4 text-[#002D74]">
            If you are already a member, easily log in now.
          </p>
          {error && <p className="mt-2 text-red-500">{error}</p>}
          <form className="flex flex-col gap-4 mt-6">
            <div className="flex mt-4 space-x-5">
              <div>
                <input
                  type="radio"
                  name="role"
                  id="user"
                  value="user"
                  onChange={handleInputChange}
                />
                <label htmlFor="user" className="ml-2">
                  User
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  name="role"
                  id="serviceProvider"
                  value="serviceProvider"
                  onChange={handleInputChange}
                />
                <label htmlFor="serviceProvider" className="ml-2">
                  Service Provider
                </label>
              </div>
            </div>

            <input
              className="w-full p-2 border rounded-md"
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
            />
            <div className="relative">
              <input
                className="w-full p-2 border rounded-md"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleInputChange}
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
            <button
              onClick={handleLogIn}
              className="bg-[#002D74] text-white py-2 rounded-xl hover:scale-105 duration-300 hover:bg-[#206ab1] font-medium"
            >
              Login
            </button>
          </form>
          <div className="mt-6 text-center text-gray-700">
            <p className="text-sm">Forgot password?</p>
          </div>
          <div className="flex items-center mt-4 space-x-2 text-sm">
            <p>Don't have an account?</p>
            <Link
              to="/signup"
              className="text-[#002D74]   rounded-xl hover:scale-110 duration-300  font-medium"
            >
              Register
            </Link>
          </div>
        </div>
        <div className="hidden w-1/2 md:block">
          <img
            className="rounded-2xl max-h-[400px]"
            src="https://media.istockphoto.com/id/513439341/photo/portrait-of-enthusiastic-business-people-in-circle.jpg?s=612x612&w=0&k=20&c=oxwsq8WGFT0ixmSojntYBEZqifne4P7DlqOWbXCqWUk="
            alt="login form"
          />
        </div>
      </div>
    </div>
  );
}
