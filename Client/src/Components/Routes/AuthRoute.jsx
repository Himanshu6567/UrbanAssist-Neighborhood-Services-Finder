import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthRoute({ children }) {
  // the only login user can access those routes
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (isAuthenticated === null) {
    return null;
  }

  return <>{children}</>;
}
