import "leaflet/dist/leaflet.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { IncidentProvider } from "./context/IncidentContext";

// Socket Provider
import { SocketProvider } from "./socket";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SocketProvider>
      <IncidentProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </IncidentProvider>
    </SocketProvider>
  </React.StrictMode>
);