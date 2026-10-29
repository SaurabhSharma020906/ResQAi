import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Clock3,
  MapPin,
  Shield,
  Ambulance,
  CheckCircle2,
  AlertTriangle,
  Navigation,
} from "lucide-react";

import { useSocket } from "../socket";
import { getMyIncidents } from "../services/incidentService";

function StatusBadge({ status }) {
  const colors = {
    Reported: "bg-red-100 text-red-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Assigned: "bg-blue-100 text-blue-700",
    Accepted: "bg-indigo-100 text-indigo-700",
    "En Route": "bg-purple-100 text-purple-700",
    Arrived: "bg-green-100 text-green-700",
    Resolved: "bg-emerald-100 text-emerald-700",
    Cancelled: "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        colors[status] ||
        "bg-slate-200 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

function Timeline({ status }) {
  const steps = [
    "Reported",
    "Assigned",
    "Accepted",
    "En Route",
    "Arrived",
    "Resolved",
  ];

  const current =
    steps.indexOf(status);

  return (
    <div className="flex flex-wrap gap-3 mt-5">

      {steps.map((step, index) => {

        const done =
          index <= current;

        return (
          <div
            key={step}
            className="flex items-center gap-2"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                done
                  ? "bg-green-600 text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {done ? (
                <CheckCircle2 size={16} />
              ) : (
                index + 1
              )}
            </div>

            <span
              className={`text-sm ${
                done
                  ? "font-semibold text-green-700"
                  : "text-slate-500"
              }`}
            >
              {step}
            </span>

          </div>
        );
      })}

    </div>
  );
}

export default function MyIncidents() {

  const socket = useSocket();

  const [incidents, setIncidents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  async function fetchIncidents() {

    try {

      const data =
        await getMyIncidents();

      setIncidents(
        Array.isArray(data)
          ? data
          : data.incidents || []
      );

    } catch {

      alert(
        "Unable to load incidents"
      );

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    // Initial remote data load.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchIncidents();

  }, []);

  // ==========================
  // Socket.IO Live Updates
  // ==========================

  useEffect(() => {

    if (!socket) return;

    const updateIncident = (
      incident
    ) => {

      setIncidents((prev) => {

        const index =
          prev.findIndex(
            (i) =>
              i._id === incident._id
          );

        if (index === -1)
          return prev;

        const copy = [...prev];

        copy[index] = incident;

        return copy;

      });

    };

    socket.on(
      "incident-updated",
      updateIncident
    );

    socket.on(
      "incident-dispatched",
      updateIncident
    );

    socket.on(
      "incident-resolved",
      updateIncident
    );

    return () => {

      socket.off(
        "incident-updated",
        updateIncident
      );

      socket.off(
        "incident-dispatched",
        updateIncident
      );

      socket.off(
        "incident-resolved",
        updateIncident
      );

    };

  }, [socket]);

  const activeIncidents =
    useMemo(
      () =>
        incidents.filter(
          (i) =>
            i.status !==
              "Resolved" &&
            i.status !==
              "Cancelled"
        ).length,
      [incidents]
    );

  const resolvedIncidents =
    useMemo(
      () =>
        incidents.filter(
          (i) =>
            i.status ===
            "Resolved"
        ).length,
      [incidents]
    );

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="text-center">

          <Clock3
            className="animate-spin mx-auto mb-4"
            size={40}
          />

          <p className="text-lg font-semibold">
            Loading incidents...
          </p>

        </div>

      </div>

    );

  }
return (
  <div className="min-h-screen bg-slate-100">

    {/* Header */}

    <div className="bg-white shadow-sm border-b">

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold">
            My Incidents
          </h1>

          <p className="text-slate-500 mt-1">
            Track all your emergency requests in real time.
          </p>

        </div>

        <Link
          to="/report-incident"
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-semibold transition"
        >
          + Report Incident
        </Link>

      </div>

    </div>

    {/* Dashboard Stats */}

    <div className="max-w-7xl mx-auto px-6 mt-8">

      <div className="grid lg:grid-cols-3 gap-5 mb-8">

        <div className="bg-white rounded-2xl shadow p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                Total Incidents
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {incidents.length}
              </h2>

            </div>

            <AlertTriangle
              size={42}
              className="text-red-500"
            />

          </div>

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                Active
              </p>

              <h2 className="text-4xl font-bold mt-2 text-blue-600">
                {activeIncidents}
              </h2>

            </div>

            <Navigation
              size={42}
              className="text-blue-600"
            />

          </div>

        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500">
                Resolved
              </p>

              <h2 className="text-4xl font-bold mt-2 text-green-600">
                {resolvedIncidents}
              </h2>

            </div>

            <Shield
              size={42}
              className="text-green-600"
            />

          </div>

        </div>

      </div>

      {/* Empty State */}

      {incidents.length === 0 ? (

        <div className="bg-white rounded-2xl shadow p-16 text-center">

          <AlertTriangle
            size={60}
            className="mx-auto text-slate-300 mb-4"
          />

          <h2 className="text-2xl font-bold mb-2">
            No Incidents Found
          </h2>

          <p className="text-slate-500">
            You haven't reported any emergency yet.
          </p>

        </div>

      ) : (

        <div className="space-y-6">

          {incidents.map((item) => (

            <div
              key={item._id}
              className="bg-white rounded-2xl shadow overflow-hidden"
            >

              {/* Card Header */}

              <div className="border-b p-6 flex flex-wrap justify-between gap-4 items-center">

                <div>

                  <h2 className="text-2xl font-bold">

                    {item.emergencyType}

                  </h2>

                  <div className="flex items-center gap-2 text-slate-500 mt-2">

                    <MapPin size={16} />

                    {item.address}

                  </div>

                </div>

                <StatusBadge
                  status={item.status}
                />

              </div>

              {/* Card Body */}

              <div className="p-6">

                <p className="text-slate-700 mb-6">

                  {item.description}

                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                  <div>

                    <p className="text-slate-500 text-sm">
                      Severity
                    </p>

                    <p className="font-bold mt-1">

                      {item.severity || "-"}

                    </p>

                  </div>

                  <div>

                    <p className="text-slate-500 text-sm">
                      Priority
                    </p>

                    <p className="font-bold mt-1">

                      {item.priority || "-"}

                    </p>

                  </div>

                  <div>

                    <p className="text-slate-500 text-sm">
                      Estimated Response
                    </p>

                    <p className="font-bold mt-1">

                      {item.estimatedResponseTime || "Calculating..."}

                    </p>

                  </div>

                  <div>

                    <p className="text-slate-500 text-sm">
                      Reported
                    </p>

                    <p className="font-bold mt-1">

                      {new Date(item.createdAt).toLocaleString()}

                    </p>

                  </div>

                  <div>

                    <p className="text-slate-500 text-sm">
                      Responders
                    </p>

                    <p className="font-bold mt-1">

                      {item.assignedResponders?.length
                        ? item.assignedResponders.join(", ")
                        : "Pending"}

                    </p>

                  </div>

                  <div>

                    <p className="text-slate-500 text-sm">
                      Incident ID
                    </p>

                    <p className="font-mono text-xs mt-1">

                      {item._id}

                    </p>

                  </div>

                </div>

                {/* Timeline */}

                <Timeline
                  status={item.status}
                />
                                {/* Assigned Responder */}

                {item.assignedResponders?.length > 0 && (

                  <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-5">

                    <div className="flex items-center gap-2 mb-4">

                      <Ambulance
                        size={22}
                        className="text-emerald-600"
                      />

                      <h3 className="font-bold text-lg text-emerald-700">
                        Emergency Response Assigned
                      </h3>

                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

                      <div>

                        <p className="text-slate-500 text-sm">
                          Assigned Team
                        </p>

                        <p className="font-semibold mt-1">
                          {item.assignedResponders.join(", ")}
                        </p>

                      </div>

                      <div>

                        <p className="text-slate-500 text-sm">
                          Current Status
                        </p>

                        <p className="font-semibold mt-1">
                          {item.status}
                        </p>

                      </div>

                      <div>

                        <p className="text-slate-500 text-sm">
                          ETA
                        </p>

                        <p className="font-semibold mt-1">
                          {item.estimatedResponseTime ||
                            "Calculating..."}
                        </p>

                      </div>

                      <div>

                        <p className="text-slate-500 text-sm">
                          Severity
                        </p>

                        <p className="font-semibold mt-1">
                          {item.severity}
                        </p>

                      </div>

                    </div>

                  </div>

                )}

                {/* Evidence Image */}

                {item.image && (

                  <div className="mt-8">

                    <img
                      src={item.image}
                      alt="Incident"
                      className="w-full max-h-[420px] object-cover rounded-xl border"
                    />

                  </div>

                )}

                {/* Footer */}

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t pt-6">

                  <div className="text-sm text-slate-500">

                    Last Updated:&nbsp;

                    {new Date(
                      item.updatedAt || item.createdAt
                    ).toLocaleString()}

                  </div>

                  <div className="flex gap-3">

                    <Link
                      to={`/incident/${item._id}`}
                      className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                    >
                      Track Live
                    </Link>

                    <Link
                      to="/report-incident"
                      className="px-5 py-2 rounded-lg border hover:bg-slate-100 transition"
                    >
                      Report Another
                    </Link>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  </div>
);

}
