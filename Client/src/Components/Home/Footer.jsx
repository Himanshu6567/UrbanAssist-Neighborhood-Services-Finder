import React, { useState } from "react";
import { FaPen } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { MdOutlineDoneOutline } from "react-icons/md";

export default function Footer() {
  return (
    <div>
      <footer className="mt-10 text-gray-100 bg-gradient-to-br from-teal-900 via-emerald-800 to-green-700">
        <div className="grid max-w-6xl grid-cols-1 gap-8 px-4 py-6 mx-auto md:grid-cols-3">
          {/* About Section */}
          <div>
            <h4 className="mb-4 text-lg font-bold">About Us</h4>
            <p className="text-gray-200">
              We connect users with reliable service providers for their
              everyday needs. Our mission is to ensure quality and satisfaction.
            </p>
          </div>
          {/* Quick Links Section */}
          <div>
            <h4 className="mb-4 text-lg font-bold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-yellow-400">
                  Home
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-yellow-400">
                  Services
                </a>
              </li>
              <li>
                <span className="hover:text-yellow-400">Contact</span>
              </li>
              <li>
                <span className="hover:text-yellow-400">Privacy Policy</span>
              </li>
            </ul>
          </div>
          {/* Contact Section */}
          <div>
            <h4 className="mb-4 text-lg font-bold">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt />
                <span>123, Service Lane, Dehradun</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPen />
                <span>support@services.com</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPen />
                <span>+91 9876543210</span>
              </li>
            </ul>
          </div>
        </div>
        {/* Copyright Section */}
        <div className="py-4 text-sm text-center text-gray-300 bg-gradient-to-br from-emerald-800 to-green-900">
          © {new Date().getFullYear()} Service Finder. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
