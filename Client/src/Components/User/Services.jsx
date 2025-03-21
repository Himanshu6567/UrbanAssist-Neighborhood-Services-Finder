import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import ServiceForm from "../ServiceForm";

import { Link } from "react-router-dom";
import { RiResetLeftFill } from "react-icons/ri";
import { useLocation } from "../Context/LocationContext";
import Loading2 from "../Home/Loading";

export default function Services() {
  const myLocation = useLocation();
  const [serviceProviders, setServiceProviders] = useState([]);
  const [fiterProvider, setFiterProvider] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [Loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    services: "teacher",
    sortBy: "Nearest",
    distance: 100,
  });

  useEffect(() => {
    handleFetchAllServiceProviders();
    console.log("location from context", myLocation);
  }, []);



  // fetch all service provider list
  const handleFetchAllServiceProviders = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        "http://localhost:8000/serviceProvider/getAllProvider",
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const allProviders = response.data.alluser;
        setServiceProviders(allProviders);

        setFiterProvider(response.data.alluser);

        setFiterProvider((prev) =>
          sortTasks(
            prev.filter((e) => e.jobCategory === filters.services),
            filters.sortBy
          )
        );
      }
    } catch (error) {
      console.error("Unable to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  
// handle book click
  const handleBookClick = (id) => {
    setSelectedServiceId(id);
    setShowForm(true);
  };


  // hide register form
  const handleCancelClick = () => {
    setShowForm(false);
    setSelectedServiceId(null);
  };

  /// find distance between user and provider
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };


  
  //distance change
  const handleDistanceChange = (e) => {
    // console.log(+e.target.value);
    const newDistance = +e.target.value;
    setFilters((prev) => ({ ...prev, distance: newDistance }));

    // serviceProviders, setServiceProviders
    // setFiterProvider((prev) => [
    //   ...serviceProviders.filter((e) => e.jobCategory == filters.services),
    // ]);

    setFiterProvider(
      serviceProviders.filter((provider) => {
        const [lat1, lng2] = provider.location.split(",");
        const A_lat = parseFloat(lat1);
        const A_long = parseFloat(lng2);
        return (
          provider.jobCategory === filters.services &&
          haversineDistance(myLocation.lat, myLocation.long, A_lat, A_long) <=
            newDistance
        );
      })
    );
  };

  const sortTasks = (tasks, criteria) => {
    // console.log(tasks, criteria);
    return [...tasks].sort((a, b) => {
      const [lat1, lng2] = a.location.split(",");
      const [lat3, lng4] = b.location.split(",");

      const A_lat = parseFloat(lat1);
      const A_long = parseFloat(lng2);
      const B_lat = parseFloat(lat3);
      const B_long = parseFloat(lng4);

      // if (!a.location || !b.location) return 0;

      if (criteria === "Nearest") {
        return (
          haversineDistance(myLocation.lat, myLocation.long, A_lat, A_long) -
          haversineDistance(myLocation.lat, myLocation.long, B_lat, B_long)
        );
      } else if (criteria === "Farthest") {
        return (
          haversineDistance(myLocation.lat, myLocation.long, B_lat, B_long) -
          haversineDistance(myLocation.lat, myLocation.long, A_lat, A_lon)
        );
      } else if (criteria === "Price Low") {
        return a.salary - b.salary;
      } else if (criteria === "Price High") {
        return b.salary - a.salary;
      }
      return 0;
    });
  };

  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    setFilters((prev) => ({ ...prev, sortBy: newSortBy }));
    setFiterProvider(sortTasks(fiterProvider, newSortBy));
  };

  const handleFilter = (updatedFilters) => {
    // console.log("up", updatedFilters);
    setFiterProvider(serviceProviders);

    setFiterProvider((prev) => [
      ...prev.filter((e) => e.jobCategory == updatedFilters.services),
    ]);
  };

  const handleFilterChange = (e) => {
    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        [e.target.name]: e.target.value,
      };

      handleFilter(updatedFilters);
      return updatedFilters;
    });
  };

  //formet the name
  function capitalizeWords(name) {
    return name
      .split(" ") // Split the string into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter
      .join(" "); // Join the words back
  }

  const handleResetFilter = () => {
    setFiterProvider(serviceProviders);
    setFilters({ service: "teacher", sortBy: "Nearest", distance: 5 });
  };

  if (Loading) {
    return (
      <div>
        <Loading2 />
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-8 lg:px-16 bg-gray-50">
      {/* Heading */}
      <div className="mb-12 text-center">
        <h2 className="font-serif text-4xl font-bold text-gray-800 lg:text-5xl">
          Find Services
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Explore our wide range of trusted local services!
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col justify-between gap-8 mb-12 lg:flex-row">
        {/* Services Dropdown */}
        <div className="flex flex-col">
          <label
            className="mb-2 text-lg font-semibold text-gray-700"
            htmlFor="services"
          >
            Services:
          </label>
          <select
            value={filters.services}
            onChange={handleFilterChange}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg"
            name="services"
            id="services"
          >
            <option value="babysitter">Babysitter</option>
            <option value="teacher">Teacher</option>
            <option value="plumber">Plumber</option>
            <option value="driver">Driver</option>
            <option value="carpenter">Carpenter</option>
            <option value="painter">Painter</option>
            <option value="House Cleaner">House Cleaner</option>
            <option value="Gardener">Gardener</option>
            <option value="electrician">Electrician</option>
            <option value="Mechanic">Mechanic</option>
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="flex flex-col">
          <label
            className="mb-2 text-lg font-semibold text-gray-700"
            htmlFor="sortBy"
          >
            Sort By:
          </label>
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg"
            name="sortBy"
            id="sortBy"
          >
            <option value="Nearest">Nearest</option>
            <option value="Farthest">Farthest</option>
            <option value="Price Low">Price Low</option>
            <option value="Price High">Price High</option>
            <option value="Rating">Rating</option>
          </select>
        </div>

        {/* Distance Radio Buttons */}
        <div className="flex flex-col">
          <label
            className="mb-2 text-lg font-semibold text-gray-700"
            htmlFor="distance"
          >
            Distance:
          </label>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                onChange={handleDistanceChange}
                value="5"
                type="radio"
                name="distance"
                id="5KM"
              />
              <label htmlFor="5KM" className="text-gray-700">
                5KM
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleDistanceChange}
                value="15"
                type="radio"
                name="distance"
                id="15KM"
              />
              <label htmlFor="15KM" className="text-gray-700">
                15KM
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                onChange={handleDistanceChange}
                value="30"
                type="radio"
                name="distance"
                id="30KM"
              />
              <label htmlFor="30KM" className="text-gray-700">
                30KM
              </label>
            </div>
            <button onClick={handleResetFilter}>
              <RiResetLeftFill />
            </button>
          </div>
        </div>
      </div>

      {/* ////////////////////////////////////// */}

      {/* Service List */}

      {fiterProvider.length >= 1 ? (
        <div className="grid gap-6 my-auto sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {fiterProvider.map((serviceProvider) => {
            const [lat, lng] = serviceProvider.location.split(",");
            const latitude = parseFloat(lat);
            const longitude = parseFloat(lng);
            return (
              <div
                key={serviceProvider._id}
                className="p-6 transition-shadow duration-300 bg-white border rounded-lg shadow-lg hover:shadow-2xl"
              >
                <div className="relative flex items-center gap-4 mb-4">
                  <img
                    className="object-cover w-12 h-12 rounded-full"
                    src={serviceProvider.image}
                    alt={serviceProvider.name}
                  />
                  <Link to={"/profile"}>
                    <FaExternalLinkAlt className="absolute top-0 right-0 " />
                  </Link>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {capitalizeWords(serviceProvider.name)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {haversineDistance(
                        myLocation.lat,
                        myLocation.long,
                        latitude,
                        longitude
                      ).toFixed(2)}
                      Km away
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-yellow-500">
                  {serviceProvider.jobCategory.charAt(0).toUpperCase() +
                    serviceProvider.jobCategory.slice(1)}
                </p>
                <p className="mb-2 text-gray-600">{serviceProvider.aboutYou}</p>
                <p className="font-medium text-gray-800">
                  Service Charge: {serviceProvider.salary}
                </p>

                <div className="flex items-center justify-between py-4">
                  <button
                    onClick={() => handleBookClick(serviceProvider._id)}
                    className="px-3 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
                  >
                    Book &gt;
                  </button>
                  <p className="font-semibold text-yellow-500">
                    {"⭐".repeat(serviceProvider.Rate)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center bg-red-100 border border-red-300 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-red-600">Sorry!</h3>
          <p className="mt-2 text-lg text-gray-700">
            There is no service provider available at your location.
          </p>
        </div>
      )}

      {/* Show Service Form when "Book" is clicked */}
      {showForm && (
        <ServiceForm
          serviceProviderId={selectedServiceId}
          onCancel={handleCancelClick}
        />
      )}
    </div>
  );
}
