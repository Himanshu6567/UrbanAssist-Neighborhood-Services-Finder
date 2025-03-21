import axios from "axios";
import React, { useState } from "react";
import { ImCancelCircle } from "react-icons/im";
import { useMessage } from "../Components/Context/MessageContext";

export default function ServiceForm({ serviceProviderId, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: null,
    file: null,
    ProviderID: serviceProviderId,
  });

  const [error, setError] = useState("");
  const [btnText, setbtnText] = useState("Submit");

  const { showMessage } = useMessage();

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      if (files.length > 0) {
        const file = files[0];

        if (!file.type.startsWith("image/")) {
          setError("Only image files are allowed!");
          return;
        }

        setFormData({ ...formData, file: file });
        setError("");
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
// get location
  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          });
          console.log("Location fetched:", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setbtnText("Submiting...");
    // const { title, description, date, time, file, location } = formData;

    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.time ||
      !formData.location ||
      !formData.file
    ) {
      setError("All fields are required.");
      return;
    }
    setError("");
    console.log("Form Submitted Data:", formData);

    console.log("Fetching service providers...");
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:8000/services/NewService",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        console.log(response.data);

        showMessage("success", "request sent successfull");
        onCancel();
      }
    } catch (error) {
      console.error("Unable to fetch data", error);
    } finally {
      setbtnText("Submit");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center h-full px-4 py-12 overflow-y-scroll bg-gray-900 bg-opacity-50 scroll min-w-1/2">
      <div className="relative p-10 mt-10 bg-white rounded-lg shadow-lg w-[90%] md:w-1/2 top-24">
        <div className="flex justify-end">
          <button onClick={onCancel}>
            <ImCancelCircle />
          </button>
        </div>
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Registration Form
          </h1>
          <p className="mt-2 text-gray-600">Register your service here</p>
        </div>
        {error && <p className="text-center text-red-500">{error}</p>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Service Title */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Service Title:
            </label>
            <input
              type="text"
              name="title"
              className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter service title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Service Description */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Service Description:
            </label>
            <textarea
              name="description"
              className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Provide a brief description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Date and Time */}
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="w-full">
              <label className="block mb-1 font-semibold text-gray-700">
                Select Date:
              </label>
              <input
                type="date"
                name="date"
                className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-full mt-4 sm:mt-0">
              <label className="block mb-1 font-semibold text-gray-700">
                Select Time:
              </label>
              <input
                type="time"
                name="time"
                className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Payment Mode */}
          {/*  */}

          {/* Location */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Allow Your Location:
            </label>
            <button
              type="button"
              onClick={handleLocation}
              className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Allow
            </button>
          </div>

          {/* File Upload */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Add Images:
            </label>
            <input
              accept="image/*"
              type="file"
              name="file"
              className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-8 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              {btnText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
