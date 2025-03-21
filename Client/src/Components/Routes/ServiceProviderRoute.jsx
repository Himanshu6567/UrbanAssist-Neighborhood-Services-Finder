import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ServiceProviderRoute({ children }) {
  // the only ServiceProvider can access those routes
  const navigate = useNavigate();
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (!role) {
      navigate("/login"); // Redirect if no role found
    } else if (role === "ServiceProvider") {
      setIsUserAuthenticated(true); // Allow access
    } else {
      navigate("/"); // Redirect non-users to home 
    }
  }, [navigate]);

  if (isUserAuthenticated === null) {
    return <div>Loading...</div>; 
  }

  return <>{children}</>;
}
