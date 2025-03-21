import React from "react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <div className="bg-[#FCFBF9] px-6 py-12 lg:px-20 lg:py-20 flex flex-col md:flex-row items-center lg:justify-around">
      {/* Left Section */}
      <div className="w-full lg:w-[40%] flex flex-col space-y-6 text-center lg:text-left">
        <h2 className="font-serif text-2xl font-bold leading-snug text-red-500 lg:text-4xl">
          Connecting neighborhoods, one service at a time. Find trusted local
          service providers with ease!
        </h2>
        <p className="mt-4 text-lg text-red-400 lg:text-xl">
          Why search far? Discover the best services right around the corner!
        </p>
        <Link
          to={"/services"}
          className="flex items-center justify-center py-3 text-white bg-indigo-500 rounded-md shadow-md md:w-44 hover:bg-indigo-600"
        >
          Get Started
        </Link>
        <p className="font-medium text-gray-600">
          Trusted by <span className="font-bold text-indigo-500">100+</span>{" "}
          happy users
        </p>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-[50%] flex justify-center mt-8 lg:mt-0">
        <img
          className="w-full h-auto max-w-md lg:max-w-lg"
          src="/image/2.png"
          alt="Service illustration"
        />
      </div>
    </div>
  );
}
