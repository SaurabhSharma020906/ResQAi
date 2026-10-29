import {
  AlertTriangle,
  ClipboardList,
  Activity,
  MapPinned,
  Hash,
  Navigation,
  Timer,
} from "lucide-react";

function IncidentCard({ incident }) {
  if (!incident) return null;

  const severityColor = {
    Low: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    High: "bg-orange-100 text-orange-700",
    Critical: "bg-red-100 text-red-700",
  };

  const statusColor = {
    Pending: "bg-gray-100 text-gray-700",
    Assigned: "bg-blue-100 text-blue-700",
    Accepted: "bg-indigo-100 text-indigo-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
    Resolved: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

      {/* Header */}

      <div className="bg-red-600 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <AlertTriangle size={20} />
          Incident Details
        </h2>
      </div>

      <div className="p-6 space-y-5">

        {/* Incident ID */}

        <InfoRow
          icon={<Hash size={18} />}
          label="Incident ID"
          value={incident._id}
        />

        {/* Emergency Type */}

        <InfoRow
          icon={<ClipboardList size={18} />}
          label="Emergency Type"
          value={incident.emergencyType}
        />

        {/* Description */}

        <div>
          <p className="text-sm text-gray-500 mb-2">
            Description
          </p>

          <div className="bg-slate-50 border rounded-xl p-4 leading-relaxed">
            {incident.description}
          </div>
        </div>

        {/* Severity */}

        <div className="flex justify-between items-center">

          <span className="font-medium flex items-center gap-2">
            <AlertTriangle size={18} />
            Severity
          </span>

          <span
            className={`px-4 py-1 rounded-full font-semibold ${
              severityColor[incident.severity]
            }`}
          >
            {incident.severity}
          </span>

        </div>

        {/* Priority */}

        <div className="flex justify-between items-center">

          <span className="font-medium">
            Priority
          </span>

          <span className="font-semibold">
            {incident.priority || "N/A"}
          </span>

        </div>

        {/* Status */}

        <div className="flex justify-between items-center">

          <span className="font-medium flex items-center gap-2">
            <Activity size={18} />
            Current Status
          </span>

          <span
            className={`px-4 py-1 rounded-full font-semibold ${
              statusColor[incident.status]
            }`}
          >
            {incident.status}
          </span>

        </div>

        {/* Estimated Response Time */}

        <InfoRow
          icon={<Timer size={18} />}
          label="Estimated Response"
          value={
            incident.estimatedResponseTime ||
            "Calculating..."
          }
        />

        {/* Coordinates */}

        <InfoRow
          icon={<Navigation size={18} />}
          label="Coordinates"
          value={`${incident.latitude}, ${incident.longitude}`}
        />

        {/* Address */}

        <InfoRow
          icon={<MapPinned size={18} />}
          label="City"
          value={`${incident.city}, ${incident.state}`}
        />

        {/* Dispatch Services */}

        <div>

          <p className="text-sm text-gray-500 mb-2">
            AI Recommended Services
          </p>

          <div className="flex flex-wrap gap-2">

            {incident.dispatchServices?.length ? (
              incident.dispatchServices.map((service) => (
                <span
                  key={service}
                  className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold"
                >
                  {service}
                </span>
              ))
            ) : (
              <span className="text-gray-500">
                No recommendation
              </span>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex gap-4">

      <div className="bg-slate-100 w-11 h-11 rounded-xl flex items-center justify-center">

        {icon}

      </div>

      <div>

        <p className="text-sm text-gray-500">
          {label}
        </p>

        <p className="font-semibold break-all">
          {value}
        </p>

      </div>

    </div>
  );
}

export default IncidentCard;