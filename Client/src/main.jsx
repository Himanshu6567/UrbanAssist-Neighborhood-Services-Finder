import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { MessageProvider } from "./Components/Context/MessageContext.jsx";
import { LocationProvider } from "./Components/Context/LocationContext.jsx";

createRoot(document.getElementById("root")).render(
  <MessageProvider>
    <LocationProvider>
      <BrowserRouter>
        <StrictMode>
          <App />
        </StrictMode>
      </BrowserRouter>
    </LocationProvider>
  </MessageProvider>
);
