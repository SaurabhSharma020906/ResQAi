import { createContext, useState } from "react";

const IncidentContext = createContext();

export function IncidentProvider({ children }) {

  const [incident, setIncident] = useState(null);

  const [nearbyServices, setNearbyServices] = useState([]);

  const [loadingServices, setLoadingServices] = useState(false);

  const [dispatching, setDispatching] = useState(null);

  // New States
  const [status, setStatus] = useState("");

  const [selectedService, setSelectedService] = useState(null);

  const [timeline, setTimeline] = useState([]);

  const [refreshIncidents, setRefreshIncidents] = useState(null);

  const value = {

    incident,
    setIncident,

    nearbyServices,
    setNearbyServices,

    loadingServices,
    setLoadingServices,

    dispatching,
    setDispatching,

    status,
    setStatus,

    selectedService,
    setSelectedService,

    timeline,
    setTimeline,

    refreshIncidents,
    setRefreshIncidents,

  };

  return (
    <IncidentContext.Provider value={value}>
      {children}
    </IncidentContext.Provider>
  );
}