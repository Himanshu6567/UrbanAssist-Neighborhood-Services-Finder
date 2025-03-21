import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { FaPen } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { MdOutlineDoneOutline } from "react-icons/md";
import MapWithDriverPath from "./Map/Map";
import { useSocket } from "./Context/SocketContext";
import { useNavigate } from "react-router-dom";
import { useMessage } from "./Context/MessageContext";
import { useLocation } from "./Context/LocationContext";
import Loading2 from "./Home/Loading";

export default function UserProfile() {
  const myLocation = useLocation();
  const [userData, setUserData] = useState({}); // state to store userData
  const [allTasks, setAllTasks] = useState([]); //  store all taks
  const [allrequests, setAllRequests] = useState([]); // store requests
  const [allCompletedAndPandindTasks, setAllCompletedAndPandindTasks] =
    useState([]);
  const [pendingTasks, setPendingTasks] = useState([]); // pending tasks
  const [completedTasks, setCompletedTasks] = useState([]); // complete task
  const [gallery, setGallery] = useState([]); // store gallery images

  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true); // is provider is available or not
  const [showMap, setShowMap] = useState(false); // state to store map show or hide
  // const [myLocation, setMyLocation] = useState({ latitude: "", longitude: "" });
  const [taskLocation, settaskLocation] = useState({}); // store user taks locations

  const [sorting, setSorting] = useState({
    // initial sorting
    ReqPending: "Nearest",
    alltasks: "Nearest",
    pendingTasks: "Nearest",
    completedTasks: "Nearest",
  });

  const socket = useSocket(); // initial socket
  const navigate = useNavigate();
  const { showMessage } = useMessage(); // notify

  useEffect(() => {
    const token = localStorage.getItem("token"); // if user in not login, redirect him to the login page
    if (!token) {
      navigate("/login");
    }
    handeGetUser(token);
    handleGetAllTasks(token);

    console.log("location from context", myLocation);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("newRequest", (data) => {
        // if new request occer
        const { ProviderID, task } = data;
        console.log("new request", ProviderID, task);
        showMessage("new", "request found"); // notify new request
        if (userData?._id && ProviderID === userData._id) {
          setAllRequests((prevReq) => {
            return [task, ...prevReq];
          });
          
        }
      });

      socket.on("reqAccept", (data) => {
        // request Acccept
        const { id, task } = data;

        showMessage("success", "Req Accepted"); // notify if the request accept

        setAllRequests(
          (
            prevRequests // update the Allrequest state
          ) => prevRequests.filter((e) => e._id !== id)
        );

        setPendingTasks((prevPending) => [...prevPending, task]);

        setAllCompletedAndPandindTasks((prevTasks) => [
          ...prevTasks.filter((e) => e.status !== "ReqPending"),
          task,
        ]);
      });

      socket.on("reqReject", (data) => {
        // request rejected
        const { id } = data;
        console.log("reject id", id);
        // update the Allrequest state
        setAllRequests((prevRequests) =>
          prevRequests.filter((e) => e._id !== id)
        );
        showMessage("success", "Req Rejected successFull");
      });
    }

    if (!socket) {
      console.log("socket not found");
    }

    return () => {
      if (socket) {
        socket.off("newRequest");
        socket.off("reqAccept");
        socket.off("reqReject");
      }
    };
  }, [socket, userData]);

  // function for get all tasks which assigned to the service provider
  const handleGetAllTasks = async (token) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/services/allTasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("task data", response.data);
      setAllTasks(response.data);

      // filter the tasks based on the status
      setAllRequests(
        response.data.filter((task) => task.status === "ReqPending")
      );

      setAllCompletedAndPandindTasks(
        response.data.filter((task) =>
          ["Pending", "Completed"].includes(task.status)
        )
      );
      setPendingTasks(
        response.data.filter((task) => task.status === "Pending")
      );

      setCompletedTasks(
        response.data.filter((task) => task.status === "Completed")
      );

      setLoading(false);
    } catch (err) {
      console.error("Invalid credentials or something went wrong!", err);
      setLoading(false);
    }
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

  // function for get the userDetails
  const handeGetUser = async (token) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/serviceProvider/verify",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUserData(response.data.user);
      console.log("my id is", response.data.user._id);

      setLoading(false);
    } catch (err) {
      console.error("Invalid credentials or something went wrong!", err);
      setLoading(false);
    }
  };

  // sort function
  const sortTasks = (tasks, criteria) => {
    console.log(tasks, criteria);
    return [...tasks].sort((a, b) => {
      if (!a.location || !b.location) return 0;

      console.log("a is:", a, "b is", b);
      if (criteria === "Nearest") {
        return (
          haversineDistance(
            myLocation.lat,
            myLocation.long,
            a.location.latitude,
            a.location.longitude
          ) -
          haversineDistance(
            myLocation.lat,
            myLocation.long,
            b.location.latitude,
            b.location.longitude
          )
        );
      } else if (criteria === "Farthest") {
        return (
          haversineDistance(
            myLocation.lat,
            myLocation.long,
            b.location.latitude,
            b.location.longitude
          ) -
          haversineDistance(
            myLocation.lat,
            myLocation.long,
            a.location.latitude,
            a.location.longitude
          )
        );
      } else if (criteria === "Newest") {
        return new Date(b.date) - new Date(a.date);
      } else if (criteria === "Oldest") {
        return new Date(a.date) - new Date(b.date);
      }
      return 0;
    });
  };

  // function for handle sorting change
  const handleSortingChange = (tab, value) => {
    console.log(`Sorting ${tab} by ${value}`);

    setSorting((prev) => ({
      ...prev,
      [tab]: value,
    }));

    const updateSortedTasks = (stateSetter, tasks) => {
      const sorted = sortTasks(tasks, value);
      console.log("bbbbbbb");
      console.log(sorted);
      stateSetter(sorted);
    };

    switch (tab) {
      case "allTasks":
        updateSortedTasks(setAllTasks, allTasks);
        break;
      case "ReqPending":
        updateSortedTasks(setAllRequests, allrequests);
        break;
      case "pendingTasks":
        updateSortedTasks(setPendingTasks, pendingTasks);
        break;
      case "completedTasks":
        updateSortedTasks(setCompletedTasks, completedTasks);
        break;
    }
  };

  // show map
  const handleShowMap = (taskLocation) => {
    settaskLocation(taskLocation);
    setShowMap(true);
  };

  /// hide map
  const handleCloseMap = () => {
    console.log("map closed");
    setShowMap(false);
    settaskLocation({});
  };

  // function for handle request rejection
  const handleRejectRequest = async (TaskId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `http://localhost:8000/services/rejectReq/${TaskId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
      }
      console.log(response.mgs);
    } catch (error) {
      console.error("Unable to fetch data", error);
    }
  };

  // function for request accept
  const handleAcceptReq = async (TaskId) => {
    console.log("id", TaskId);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.patch(
        "http://localhost:8000/services/acceptReq",
        { TaskId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        console.log(response.data);
      }
    } catch (error) {
      console.error("Unable to fetch data", error);
    }
  };

  // function for toggle the service provider availble or not
  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
  };

  // function for logout
  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userid");
    navigate("/login");
  };

  // formet the date in DD/MM/YY
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0"); // Ensures 2 digits
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2); // Gets last 2 digits of year
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    // if loading state, show the loading bar
    return <Loading2 />;
  }

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      {/* Header Section */}
      <div className="relative">
        <div>
          <img
            className="object-cover w-full h-56"
            src="https://media.istockphoto.com/id/1317584985/photo/social-media-and-network.jpg?s=612x612&w=0&k=20&c=0d74KNiIifGvT10QDYvvsAchywxec4Xqk10-U_oe5IY="
            alt="Background"
          />
          <button
            title="Edit Profile"
            className="absolute p-2 bg-white rounded-full shadow-lg top-3 right-10 hover:bg-gray-200"
          >
            <FaPen className="text-gray-600" />
          </button>
        </div>
        <div className="flex justify-center -mt-20">
          <img
            className="border-4 border-white rounded-full shadow-md h-36 w-36"
            src={userData.image}
            alt="Profile"
          />
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="mt-6 text-center">
        <h2 className="text-2xl font-bold">{userData.name}</h2>
        <p className="text-gray-600">{userData.email}</p>
        <p className="text-gray-600">{userData.mobile}</p>
        <p className="font-semibold text-gray-700">
          Profession:
          <span className="ml-1 text-indigo-600">{userData.jobCategory}</span>
        </p>
        <div className="px-4 my-2 font-bold bg-gray-100">
          <p>{userData.aboutYou}</p>
        </div>
        <div className="mt-2">
          <span className="text-yellow-500"> {"⭐".repeat(userData.Rate)}</span>
        </div>

        {/* Availability Status */}
        <div className="mt-4">
          <span
            className={`inline-block px-4 py-2 rounded-full text-white font-semibold ${
              isAvailable ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {isAvailable ? "Available" : "Unavailable"}
          </span>
          <button
            onClick={toggleAvailability}
            className="px-4 py-2 ml-4 text-white bg-indigo-600 rounded-full hover:bg-indigo-700"
          >
            Toggle Status
          </button>
        </div>
      </div>

      {/* Requests and Tasks Section */}
      <div className="grid grid-cols-1 gap-6 px-4 mt-10 md:grid-cols-2 lg:grid-cols-4">
        {/* All Requests */}
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-bold text-red-500">
              All Requests ({allrequests.length})
            </h2>
            <select
              className="p-2 bg-gray-100 rounded"
              value={sorting.ReqPending}
              onChange={(e) =>
                handleSortingChange("ReqPending", e.target.value)
              }
            >
              <option value="Nearest">Nearest</option>
              <option value="Farthest">Farthest</option>
              <option value="Oldest">Oldest</option>
              <option value="Newest">Newest</option>
            </select>
          </div>
          <div className="space-y-4">
            {allrequests.length > 0 ? (
              allrequests.map((request, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{request.serviceTitle}</h3>
                    <p className="text-sm text-gray-500">
                      {(() => {
                        const distance = haversineDistance(
                          myLocation.lat,
                          myLocation.long,
                          request.location.latitude,
                          request.location.longitude
                        );
                        return distance < 1
                          ? `${(distance * 1000).toFixed(0)} meters`
                          : `${distance.toFixed(2)} KM`;
                      })()}
                    </p>
                    <p className="text-sm">{formatDate(request.date)}</p>
                  </div>
                  <div className="flex space-x-3">
                    <FaMapMarkerAlt
                      onClick={() => handleShowMap(request.location)}
                      className="text-blue-600 cursor-pointer"
                    />
                    <MdCancel
                      onClick={() => handleRejectRequest(request._id)}
                      className="text-red-600 cursor-pointer"
                    />
                    <MdOutlineDoneOutline
                      onClick={() => handleAcceptReq(request._id)}
                      className="text-green-600 cursor-pointer"
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>No pending requests.</p>
            )}
          </div>
        </div>

        {/* All Tasks */}
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-bold">
              All Tasks ({allCompletedAndPandindTasks.length})
            </h2>
            <select
              className="p-2 bg-gray-100 rounded"
              value={sorting.alltasks}
              onChange={(e) => handleSortingChange("allTasks", e.target.value)}
            >
              <option value="Nearest">Nearest</option>
              <option value="Farthest">Farthest</option>
              <option value="Oldest">Oldest</option>
              <option value="Newest">Newest</option>
            </select>
          </div>
          <div className="space-y-4">
            {allCompletedAndPandindTasks.length > 0 ? (
              allCompletedAndPandindTasks.map((request, i) => {
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{request.serviceTitle}</h3>
                      <p className="text-sm text-gray-500">
                        {(() => {
                          const distance = haversineDistance(
                            myLocation.lat,
                            myLocation.long,
                            request.location.latitude,
                            request.location.longitude
                          );
                          return distance < 1
                            ? `${(distance * 1000).toFixed(0)} meters`
                            : `${distance.toFixed(2)} KM`;
                        })()}
                      </p>
                      <p className="text-sm">{formatDate(request.date)}</p>
                    </div>
                    <FaMapMarkerAlt
                      onClick={() => handleShowMap(request.location)}
                      className="text-blue-600 cursor-pointer"
                    />
                  </div>
                );
              })
            ) : (
              <p>No tasks available.</p>
            )}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-bold">
              Pending Tasks({pendingTasks.length})
            </h2>
            <select
              className="p-2 bg-gray-100 rounded"
              value={sorting.pendingTasks}
              onChange={(e) =>
                handleSortingChange("pendingTasks", e.target.value)
              }
            >
              <option value="Nearest">Nearest</option>
              <option value="Farthest">Farthest</option>
              <option value="Oldest">Oldest</option>
              <option value="Newest">Newest</option>
            </select>
          </div>
          <div className="space-y-4">
            {pendingTasks.length > 0 ? (
              pendingTasks.map((request, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{request.serviceTitle}</h3>
                    <p className="text-sm text-gray-500">
                      {(() => {
                        const distance = haversineDistance(
                          myLocation.lat,
                          myLocation.long,
                          request.location.latitude,
                          request.location.longitude
                        );
                        return distance < 1
                          ? `${(distance * 1000).toFixed(0)} meters`
                          : `${distance.toFixed(2)} KM`;
                      })()}
                    </p>
                    <p className="text-sm">{formatDate(request.date)}</p>
                  </div>
                  <FaMapMarkerAlt
                    onClick={() => handleShowMap(request.location)}
                    className="text-blue-600 cursor-pointer"
                  />
                </div>
              ))
            ) : (
              <p>No pending Tasks.</p>
            )}
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-bold">
              Completed Tasks ({completedTasks.length})
            </h2>
            <select
              className="p-2 bg-gray-100 rounded"
              value={sorting.completedTasks}
              onChange={(e) =>
                handleSortingChange("completedTasks", e.target.value)
              }
            >
              <option value="Nearest">Nearest</option>
              <option value="Farthest">Farthest</option>
              <option value="Oldest">Oldest</option>
              <option value="Newest">Newest</option>
            </select>
          </div>
          <div className="space-y-4">
            {completedTasks.length > 0 ? (
              completedTasks.map((request, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h3 className="font-semibold">{request.serviceTitle}</h3>
                    <p className="text-sm text-gray-500">
                      {(() => {
                        const distance = haversineDistance(
                          myLocation.lat,
                          myLocation.long,
                          request.location.latitude,
                          request.location.longitude
                        );
                        return distance < 1
                          ? `${(distance * 1000).toFixed(0)} meters`
                          : `${distance.toFixed(2)} KM`;
                      })()}
                    </p>
                    <p className="text-sm">{formatDate(request.date)}</p>
                  </div>
                  <FaMapMarkerAlt
                    onClick={() => handleShowMap(request.location)}
                    className="text-blue-600 cursor-pointer"
                  />
                </div>
              ))
            ) : (
              <p>No tasks Completed.</p>
            )}
          </div>
        </div>
      </div>

      {showMap && (
        <div>
          <MapWithDriverPath
            myLocation={myLocation}
            taskLocation={taskLocation}
            handleCloseMap={handleCloseMap}
          />
        </div>
      )}

      {/* Gallery Section */}
      <div className="p-6 mb-6 bg-white rounded-lg shadow">
        <h3 className="mb-4 text-lg font-bold">Gallery</h3>
        {gallery.length >= 1 ? (
          <div className="grid grid-cols-3 gap-4">
            <img
              src="/serviceImage/project1.jpg"
              alt="Project 1"
              className="rounded shadow"
            />
            <img
              src="/serviceImage/project2.jpg"
              alt="Project 2"
              className="rounded shadow"
            />
            <img
              src="/serviceImage/project3.jpg"
              alt="Project 3"
              className="rounded shadow"
            />
          </div>
        ) : (
          <div>there is no any photos in the galary</div>
        )}
      </div>
      {/* Logout Button */}
      <div className="flex justify-center mt-10 mb-6">
        <button
          onClick={handleLogOut}
          className="px-6 py-2 text-white bg-indigo-600 rounded-full hover:bg-indigo-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
