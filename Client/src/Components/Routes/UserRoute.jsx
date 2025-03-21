import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserRoute({ children }) {
  // the only user can access those routes not service provider

  const navigate = useNavigate();
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (!role) {
      navigate("/login"); // Redirect if no role found
    } else if (role === "user") {
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
