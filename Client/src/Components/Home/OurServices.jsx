import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaPlus } from "react-icons/fa6";

export default function OurServices() {
  const [serviceData, setServiceData] = useState([]); // state to store the serviceData
  const [bookbtn, setBookbtn] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role == "ServiceProvider") {
      setBookbtn(true);
    }
    handleGetServiceData();
  }, []);

  // function to fetch the service data
  const handleGetServiceData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/initialService");
      if (response.status === 201) {
        setServiceData(response.data);
      }
    } catch (error) {
      console.error("enable to fatch initial services", error);
    }
  };

  return (
    <div className="px-6 py-12 bg-white">
      {/* Section Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-700 lg:text-4xl">
          Our Services
        </h2>
        <p className="mt-2 text-gray-500">
          Explore our wide range of trusted local services!
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Service Card */}

        {serviceData.map((Service, index) => {
          return (
            <div
              key={index}
              className="w-full transition-shadow bg-white border border-black rounded-lg shadow-lg hover:border-2 hover:shadow-xl"
            >
              <div className="overflow-hidden ">
                <img
                  className="w-full transition-transform duration-300 ease-in-out rounded-t-lg h-44 hover:scale-105"
                  src={Service.photo}
                  alt="Service"
                />
              </div>
              <div className="p-5">
                <a href="#">
                  <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">
                    {Service.title}
                  </h5>
                </a>
                <p className="mb-4 text-gray-600">{Service.discription}</p>

                <button
                  disabled={bookbtn}
                  className={`px-4 py-2 space-x-3 text-sm font-medium text-white rounded-lg
    ${
      bookbtn
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-indigo-400 hover:bg-indigo-700"
    }`}
                >
                  {bookbtn ? (
                    <span className="inline-flex items-center space-x-2">
                      Book
                    </span> // Show only text when disabled
                  ) : (
                    <Link
                      to="/services"
                      className="inline-flex items-center space-x-2"
                    >
                      <span>Book</span> <FaPlus />
                    </Link>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
