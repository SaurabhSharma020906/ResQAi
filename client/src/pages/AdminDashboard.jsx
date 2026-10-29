import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import AdminStats from "../components/admin/AdminStats";
import IncidentTable from "../components/admin/IncidentTable";
import IncidentModal from "../components/admin/IncidentModal";
import AssignResponderModal from "../components/admin/AssignResponderModal";

import { useSocket } from "../socket";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function AdminDashboard() {
  const socket = useSocket();

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [assigningIncident, setAssigningIncident] = useState(null);

  const user = {
    name: "Administrator",
    role: "Admin",
  };

  // ==========================================
  // Fetch Incidents
  // ==========================================

  const fetchIncidents = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_BASE}/incidents/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIncidents(res.data.incidents || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // Initial Load
  // ==========================================

  useEffect(() => {
    // Initial remote data load.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchIncidents();
  }, [fetchIncidents]);

  // ==========================================
  // Socket Events
  // ==========================================

  useEffect(() => {
    if (!socket) return;

    socket.on("incident-created", (incident) => {
      console.log("🚨 New Incident", incident);

      fetchIncidents();
    });

    socket.on("incident-updated", (incident) => {
      console.log("♻ Incident Updated", incident);

      fetchIncidents();

      if (
        selectedIncident &&
        selectedIncident._id === incident._id
      ) {
        setSelectedIncident(incident);
      }
    });

    socket.on("incident-dispatched", (incident) => {
      console.log("🚑 Incident Dispatched", incident);

      fetchIncidents();

      if (
        selectedIncident &&
        selectedIncident._id === incident._id
      ) {
        setSelectedIncident(incident);
      }
    });

    socket.on("incident-resolved", (incident) => {
      console.log("✅ Incident Resolved", incident);

      fetchIncidents();

      if (
        selectedIncident &&
        selectedIncident._id === incident._id
      ) {
        setSelectedIncident(incident);
      }
    });

    return () => {
      socket.off("incident-created");
      socket.off("incident-updated");
      socket.off("incident-dispatched");
      socket.off("incident-resolved");
    };
  }, [
    socket,
    fetchIncidents,
    selectedIncident,
  ]);

  // ==========================================
  // Dashboard Stats
  // ==========================================

  const stats = {
    total: incidents.length,

    pending: incidents.filter(
      (i) => i.status === "Pending"
    ).length,

    active: incidents.filter(
      (i) =>
        i.status === "Assigned" ||
        i.status === "Accepted" ||
        i.status === "In Progress"
    ).length,

    resolved: incidents.filter(
      (i) => i.status === "Resolved"
    ).length,
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-bold">
        Loading Dashboard...
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="flex bg-slate-100 min-h-screen">

      <AdminSidebar />

      <div className="flex-1 p-8 overflow-auto">

        <AdminHeader user={user} />

        <AdminStats stats={stats} />

        <IncidentTable
          incidents={incidents}
          onView={(incident) =>
            setSelectedIncident(incident)
          }
          onAssign={(incident) =>
            setAssigningIncident(incident)
          }
        />

        {selectedIncident && (
          <IncidentModal
            incident={selectedIncident}
            onClose={() =>
              setSelectedIncident(null)
            }
            refreshIncidents={fetchIncidents}
            setSelectedIncident={
              setSelectedIncident
            }
          />
        )}

        {assigningIncident && (
          <AssignResponderModal
            incident={assigningIncident}
            onClose={() => setAssigningIncident(null)}
            onAssigned={async (updatedIncident) => {
              await fetchIncidents();
              setSelectedIncident(updatedIncident);
            }}
          />
        )}

      </div>

    </div>
  );
}

export default AdminDashboard;