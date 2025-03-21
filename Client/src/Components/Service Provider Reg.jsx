import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMessage } from "../Components/Context/MessageContext";
export default function ServiceProviderReg() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showMessage } = useMessage();
  const { email, password, name, role, mobile } = location.state || {};
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [btnText, setBtnText] = useState("Submit");
  const [formData, setFormData] = useState({
    name: name,
    email: email,
    password: password,
    mobile: mobile,
    role: role,
    image: null,
    DoB: "",
    aboutYou: "",
    jobCategory: "",
    salary: "",
    workDescription: "",
    gender: "",
    preferenceDistance: "",
    paymentType: "",
    location: null,
  });

  function handleChange(e) {
    const { name, value, type, files, id } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file && file.type.startsWith("image/")) {
        setFormData((prev) => ({ ...prev, image: file }));
      } else {
        showMessage("Error", "Please select a valid image file.");
      }
    } else if (type === "radio") {
      setFormData((prev) => ({ ...prev, [name]: id }));
    } else if (name === "salary") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "jobCategory" && value === "other") {
      setShowOtherInput(true);
    } else if (name === "jobCategory" && value !== "other") {
      setShowOtherInput(false);
    }
  }

  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          setFormData((prev) => ({ ...prev, location: [latitude, longitude] }));
        },
        (error) => console.error("Error getting location:", error.message)
      );
    } else {
      showMessage("Error", "Geolocation is not supported by your browser.");
      console.log("Geolocation is not supported by your browser.");
    }
  }

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setBtnText("Submitting...");
    const {
      name,
      email,
      password,
      mobile,
      image,
      DoB,
      aboutYou,
      jobCategory,
      salary,
      workDescription,
      gender,
      preferenceDistance,
      paymentType,
      location,
      role,
    } = formData;

    const FrmData = new FormData();
    FrmData.append("name", name);
    FrmData.append("email", email);
    FrmData.append("password", password);
    FrmData.append("DoB", DoB);
    FrmData.append("aboutYou", aboutYou);
    FrmData.append("jobCategory", jobCategory);
    FrmData.append("image", image);
    FrmData.append("salary", salary);
    FrmData.append("workDescription", workDescription);
    FrmData.append("gender", gender);
    FrmData.append("preferenceDistance", preferenceDistance);
    FrmData.append("mobile", mobile);
    FrmData.append("paymentType", paymentType);
    FrmData.append("location", location);
    FrmData.append("role", role);

    try {
      const response = await axios.post(
        "http://localhost:8000/serviceProvider/createNewServiceProvider",
        FrmData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(response.data);
      if (response.status == 201) {
        showMessage("success", "SignUp Complate");
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
    } finally {
      setBtnText("Submit");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-700">
          Service Provider Registration
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              Profile Picture
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              Date of Birth
            </label>
            <input
              type="date"
              name="DoB"
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Gender</label>
            <div className="flex mt-2 space-x-4">
              {["male", "female"].map((gender) => (
                <label key={gender}>
                  <input
                    type="radio"
                    name="gender"
                    id={gender}
                    onChange={handleChange}
                  />
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              About You
            </label>
            <textarea
              name="aboutYou"
              placeholder="Tell us about yourself"
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              Job Category
            </label>
            <select
              name="jobCategory"
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md"
            >
              {[
                "House Cleaner",
                "Gardener",
                "Electrician",
                "Mechanic",
                "Teacher",
                "Babysitter",
                "Carpenter",
                "Driver",
                "Plumber",
                "Painter",
                "Other",
              ].map((job) => (
                <option key={job} value={job.toLowerCase()}>
                  {job}
                </option>
              ))}
            </select>
            {showOtherInput && (
              <div className="flex flex-col mt-2">
                <label className="text-sm font-medium text-gray-600">
                  Other
                </label>
                <input
                  type="text"
                  name="specific"
                  placeholder="Please specify"
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-md"
                />
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Preference Distance
            </label>
            <div className="flex mt-2 space-x-4">
              {[5, 10, 15].map((distance) => (
                <label key={distance}>
                  <input
                    type="radio"
                    name="preferenceDistance"
                    id={distance.toString()}
                    onChange={handleChange}
                  />
                  {distance} km
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Payment Type
            </label>
            <div className="flex mt-2 space-x-4">
              {["Per Work", "Per Hour", "Per Month"].map((type) => (
                <label key={type}>
                  <input
                    type="radio"
                    name="paymentType"
                    id={type.toLowerCase().replace(" ", "_")}
                    onChange={handleChange}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              service charge
            </label>
            <input
              type="number"
              name="salary"
              placeholder="Enter your salary"
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md no-spinner"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-600">
              Allow your current location
            </label>
            <input
              type="checkbox"
              onClick={getCurrentLocation}
              className="px-4 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              Work Description
            </label>
            <textarea
              name="workDescription"
              placeholder="Describe your work"
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white transition duration-300 bg-blue-500 rounded-md hover:bg-blue-600"
          >
            {btnText}
          </button>
        </form>
      </div>
    </div>
  );
}
