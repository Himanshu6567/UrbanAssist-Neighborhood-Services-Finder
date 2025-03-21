import React, { useEffect, useState } from "react";
import { ImCancelCircle } from "react-icons/im";

const MapWithDriverPath = ({ myLocation, taskLocation, handleCloseMap }) => {
  console.log(myLocation, taskLocation);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMap = () => {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: myLocation.lat, lng: myLocation.long },
        zoom: 20,
      });

      const origin = { lat: myLocation.lat, lng: myLocation.long };
      const destination = {
        lat: +taskLocation.latitude,     // convert string to number
        lng: +taskLocation.longitude,
      };

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);

      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
          } else {
            console.error("Directions request failed due to " + status);
          }
          setLoading(false); // Hide loader after the map and route are loaded
        }
      );
    };

    if (!window.google || !window.google.maps) {
      const script = document.createElement("script");
      script.src = `https://maps.gomaps.pro/maps/api/js?key="MY_Api_KEY"&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      window.initMap = loadMap;
    } else {
      loadMap();
    }
  }, [myLocation, taskLocation]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
      <div className="absolute pt-2 bg-white border border-black rounded-t-2xl">
        <div className="flex justify-end px-4">
          <button onClick={handleCloseMap} className="mb-1">
            <ImCancelCircle />
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center w-96 h-96">
            <p className="text-lg font-semibold">Loading map...</p>
          </div>
        )}

        <div
          id="map"
          className={`border-2 w-96 h-96 ${loading ? "hidden" : ""}`}
        ></div>
      </div>
    </div>
  );
};

export default MapWithDriverPath;
