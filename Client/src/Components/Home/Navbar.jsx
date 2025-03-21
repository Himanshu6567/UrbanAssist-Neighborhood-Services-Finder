import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogIn, setisLogIn] = useState(false); //if isLogIn is true so show logout button else show login button

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      setisLogIn(true);
    } else {
      setisLogIn(false);
    }
  }, [token]);

  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // logout button
  const handleLogOut = () => {
    setIsMenuOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userid");
    navigate("/login");
  };

  return (
    <div>
      <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-between max-w-screen-xl p-4 mx-auto">
          <Link
            to={"/"}
            className="flex items-center space-x-3 rtl:space-x-reverse ml-7"
          >
            <img
              src="https://cdn.pixabay.com/photo/2024/07/06/04/27/map-8875911_1280.png"
              className="h-12"
              alt="Urban Assist"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              UrbanAssist
            </span>
          </Link>
          <button
            type="button"
            onClick={toggleMenu}
            className="inline-flex items-center justify-center w-10 h-10 p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-multi-level"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } w-full md:block md:w-auto `}
            id="navbar-multi-level"
          >
            <ul className="flex flex-col p-4 mt-4 font-medium border border-gray-100 rounded-lg md:items-center justify- md:p-0 bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link
                  to={"/services"}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Services
                </Link>
              </li>
              {!isLogIn && (
                <li onClick={() => setIsMenuOpen(false)}>
                  <Link
                    to={"/login"}
                    className="block px-3 py-2 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  >
                    LogIn
                  </Link>
                </li>
              )}

              {isLogIn && (
                <li
                  onClick={handleLogOut}
                  className="px-3 py-2 text-gray-900 rounded cursor-pointer hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  <button>Logout</button>
                </li>
              )}

              <Link
                onClick={() => setIsMenuOpen(false)}
                title="only service Provider can access this route"
                to={"/UserProfile"}
              >
                <img
                  src="/image/logo.png"
                  className="block w-10 h-10 p-1 text-white bg-blue-700 rounded-full cursor-pointer md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
                  aria-current="page"
                />
              </Link>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
