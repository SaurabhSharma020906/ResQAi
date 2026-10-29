import {
  Eye,
  UserCheck,
} from "lucide-react";

function IncidentTable({
  incidents = [],
  onView,
  onAssign,
}) {
  if (!incidents.length) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
        <h2 className="text-2xl font-bold mb-2">
          No Incidents Found
        </h2>

        <p className="text-gray-500">
          New emergency reports will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

      <div className="px-6 py-5 border-b">
        <h2 className="text-2xl font-bold">
          🚨 Incident Management
        </h2>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="text-left p-4">
                Emergency
              </th>

              <th className="text-left p-4">
                Citizen
              </th>

              <th className="text-left p-4">
                Severity
              </th>

              <th className="text-left p-4">
                Priority
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-center p-4">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {incidents.map((incident) => (

              <tr
                key={incident._id}
                className="border-b hover:bg-slate-50 transition"
              >

                <td className="p-4">
                  <div className="font-semibold">
                    {incident.emergencyType}
                  </div>

                  <div className="text-sm text-gray-500">
                    {incident.city}
                  </div>
                </td>

                <td className="p-4">
                  <div>
                    {incident.fullName}
                  </div>

                  <div className="text-sm text-gray-500">
                    {incident.phone}
                  </div>
                </td>

                <td className="p-4">

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

                </td>

                <td className="p-4">
                  {incident.priority}
                </td>

                <td className="p-4">

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

                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-3">

                    <button
                      onClick={() =>
                        onView(incident)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() =>
                        onAssign(incident)
                      }
                      className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-2"
                    >
                      <UserCheck size={18} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default IncidentTable;