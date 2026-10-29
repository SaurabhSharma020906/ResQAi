
function RecentIncidents({ incidents = [], onViewAll }) {
  if (!incidents.length) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            🚨 Recent Incidents
          </h2>
        </div>

        <div className="text-center py-16">
          <div className="text-7xl mb-4">📭</div>

          <h3 className="text-2xl font-semibold text-gray-700">
            No incidents found
          </h3>

          <p className="text-gray-500 mt-2">
            Your recently reported emergencies will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          🚨 Recent Incidents
        </h2>

        <button
          onClick={onViewAll}
          className="text-red-600 hover:text-red-700 font-semibold"
        >
          View All →
        </button>
      </div>

      <div className="space-y-6">
        {incidents.map((incident) => (
          <div
            key={incident._id}
            className="border rounded-2xl overflow-hidden shadow hover:shadow-xl transition duration-300"
          >
            {/* Header */}
            <div className="flex justify-between items-center bg-gray-50 px-6 py-4">
              <div>
                <h3 className="text-xl font-bold">
                  🚨 {incident.emergencyType}
                </h3>

                <p className="text-sm text-gray-500">
                  {new Date(
                    incident.createdAt
                  ).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold
                  ${
                    incident.status === "Resolved"
                      ? "bg-green-100 text-green-700"
                      : incident.status === "Assigned"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {incident.status}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold
                  ${
                    incident.severity === "Critical"
                      ? "bg-red-100 text-red-700"
                      : incident.severity === "High"
                      ? "bg-orange-100 text-orange-700"
                      : incident.severity === "Medium"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {incident.severity}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="grid lg:grid-cols-2 gap-6 p-6">
              {/* Image */}
              <div>
                {incident.image ? (
                  <img
                    src={incident.image}
                    alt="Incident"
                    className="w-full h-72 object-cover rounded-xl"
                  />
                ) : (
                  <div className="h-72 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700">
                    📍 Location
                  </h4>

                  <p className="text-gray-600">
                    {incident.address}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700">
                    📝 Description
                  </h4>

                  <p className="text-gray-600">
                    {incident.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">
                      Priority
                    </p>

                    <p className="font-bold text-blue-700">
                      {incident.priority || "N/A"}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">
                      ETA
                    </p>

                    <p className="font-bold text-green-700">
                      {incident.estimatedResponseTime || "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    🚑 Dispatch Services
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {incident.dispatchServices?.length ? (
                      incident.dispatchServices.map((service) => (
                        <span
                          key={service}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                        >
                          {service}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">
                        None
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    👨‍🚒 Assigned Responders
                  </h4>

                  {incident.assignedResponders?.length ? (
                    <ul className="space-y-2">
                      {incident.assignedResponders.map(
                        (r, index) => (
                          <li
                            key={index}
                            className="bg-gray-100 rounded-lg p-3"
                          >
                            <div className="font-semibold">
                              {r.responderType}
                            </div>

                            <div className="text-sm text-gray-600">
                              {r.responder?.name ||
                                "Responder Assigned"}
                            </div>

                            <div className="text-xs text-gray-500">
                              {r.distance?.toFixed(2)} km away
                            </div>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-gray-500">
                      No responders assigned yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentIncidents;