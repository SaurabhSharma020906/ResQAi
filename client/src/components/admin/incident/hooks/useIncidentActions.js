import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function useIncidentActions(
  incident,
  refreshIncidents,
  setSelectedIncident
) {
  const [nearbyServices, setNearbyServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [dispatching, setDispatching] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // ==========================================
  // Fetch Nearby Emergency Services
  // ==========================================

  const fetchNearbyServices = async () => {
    if (!incident) return;

    try {
      setLoadingServices(true);

      const latitude =
        incident.latitude ??
        incident.location?.coordinates?.[1];

      const longitude =
        incident.longitude ??
        incident.location?.coordinates?.[0];

      if (latitude == null || longitude == null) {
        setNearbyServices([]);
        return;
      }

      const response = await axios.get(
        `${API_BASE}/emergency/nearby`,
        {
          params: {
            lat: latitude,
            lng: longitude,
          },
        }
      );

      setNearbyServices(response.data.services || []);
    } catch (error) {
      console.error("Failed to fetch nearby services:", error);
      setNearbyServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  // ==========================================
  // Dispatch Emergency Service
  // ==========================================

  const dispatchService = async (service) => {
    try {
      setDispatching(service._id || service.id || service.name);

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_BASE}/incidents/${incident._id}/dispatch`,
        {
          service: {
            _id: service._id,
            id: service.id,
            type: service.type,
            name: service.name,
            address: service.address,
            latitude: Number(
              service.latitude ?? service.lat ?? 0
            ),
            longitude: Number(
              service.longitude ?? service.lon ?? 0
            ),
            distance: Number(service.distance ?? 0),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedIncident = response.data.incident;

      if (refreshIncidents) {
        await refreshIncidents();
      }

      if (setSelectedIncident) {
        setSelectedIncident(updatedIncident);
      }

      // Refresh nearby services so the map,
      // route and dispatched service update instantly.
      await fetchNearbyServices();

      return {
        success: true,
        incident: updatedIncident,
      };
    } catch (error) {
      console.error("Dispatch failed:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Dispatch Failed",
      };
    } finally {
      setDispatching(null);
    }
  };

  // ==========================================
  // Update Incident Status
  // ==========================================

  const updateStatus = async (status) => {
    try {
      setUpdatingStatus(true);

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API_BASE}/incidents/${incident._id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedIncident = response.data.incident;

      if (refreshIncidents) {
        await refreshIncidents();
      }

      if (setSelectedIncident) {
        setSelectedIncident(updatedIncident);
      }

      // If location changes or status resets,
      // keep nearby services synchronized.
      await fetchNearbyServices();

      return {
        success: true,
        incident: updatedIncident,
      };
    } catch (error) {
      console.error("Status update failed:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Status Update Failed",
      };
    } finally {
      setUpdatingStatus(false);
    }
  };

  return {
    nearbyServices,
    loadingServices,
    dispatching,
    updatingStatus,

    fetchNearbyServices,
    dispatchService,
    updateStatus,
  };
}