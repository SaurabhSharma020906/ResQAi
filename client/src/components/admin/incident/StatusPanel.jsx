import { useState } from "react";
import {
  ClipboardCheck,
  Save,
  Loader2,
} from "lucide-react";

const STATUS_OPTIONS = [
  "Pending",
  "Assigned",
  "Accepted",
  "In Progress",
  "Resolved",
  "Cancelled",
];

function StatusPanel({
  incident,
  updateStatus,
  updatingStatus,
}) {
  const [status, setStatus] = useState(incident?.status || "Pending");

  if (!incident) return null;

  const getStatusColor = (value) => {
    switch (value) {
      case "Pending":
        return "bg-gray-100 text-gray-700";

      case "Assigned":
        return "bg-blue-100 text-blue-700";

      case "Accepted":
        return "bg-indigo-100 text-indigo-700";

      case "In Progress":
        return "bg-yellow-100 text-yellow-700";

      case "Resolved":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleSave = async () => {
    if (status === incident.status) return;

    const result = await updateStatus(status);

    if (!result.success) {
      alert(result.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

      {/* Header */}

      <div className="bg-emerald-600 text-white px-6 py-4">

        <h2 className="text-xl font-bold flex items-center gap-2">
          <ClipboardCheck size={22} />
          Incident Status
        </h2>

      </div>

      <div className="p-6 space-y-6">

        {/* Current Status */}

        <div>

          <p className="text-sm text-gray-500 mb-2">
            Current Status
          </p>

          <span
            className={`inline-block px-4 py-2 rounded-full font-semibold ${getStatusColor(
              incident.status
            )}`}
          >
            {incident.status}
          </span>

        </div>

        {/* Dropdown */}

        <div>

          <label className="block text-sm font-medium mb-2">
            Update Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {STATUS_OPTIONS.map((item) => (
              <option key={item}>
                {item}
              </option>
            ))}
          </select>

        </div>

        {/* Save Button */}

        <button
          onClick={handleSave}
          disabled={
            updatingStatus ||
            status === incident.status
          }
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2 transition"
        >
          {updatingStatus ? (
            <>
              <Loader2
                className="animate-spin"
                size={18}
              />
              Updating...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Status
            </>
          )}
        </button>

      </div>

    </div>
  );
}

export default StatusPanel;