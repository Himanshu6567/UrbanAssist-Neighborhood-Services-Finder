import { createContext, useContext, useEffect, useState } from "react";
import { useMessage } from "../Context/MessageContext";
export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const { showMessage } = useMessage();
  const [myLocation, setMyLocation] = useState({ lat: "", long: "" });

  useEffect(() => {
    getCurrentLocation();  // get users current location when the page load
  }, []);

  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          setMyLocation({ lat: latitude, long: longitude });
        },
        (error) => console.error("Error getting location:", error.message)
      );
    } else {
      showMessage("Error", "Geolocation is not supported by your browser.");
      console.log("Geolocation is not supported by your browser.");
    }
  }

  return (
    <LocationContext.Provider value={myLocation}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
