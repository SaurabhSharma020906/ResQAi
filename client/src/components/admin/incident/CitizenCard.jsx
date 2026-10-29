import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react";

function CitizenCard({ incident }) {
  if (!incident) return null;

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">

      <div className="bg-blue-600 text-white px-6 py-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <User size={20} />
          Citizen Information
        </h2>
      </div>

      <div className="p-6 space-y-5">

        <InfoRow
          icon={<User size={18} />}
          color="blue"
          label="Name"
          value={incident.fullName}
        />

        <InfoRow
          icon={<Phone size={18} />}
          color="green"
          label="Phone"
          value={incident.phone}
        />

        <InfoRow
          icon={<Mail size={18} />}
          color="purple"
          label="Email"
          value={incident.user?.email || "Not Available"}
        />

        <InfoRow
          icon={<MapPin size={18} />}
          color="red"
          label="Location"
          value={incident.address}
        />

        <InfoRow
          icon={<Calendar size={18} />}
          color="yellow"
          label="Reported On"
          value={formatDate(incident.createdAt)}
        />

      </div>

    </div>
  );
}

function InfoRow({
  icon,
  color,
  label,
  value,
}) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-600",
  };

  return (
    <div className="flex gap-4">

      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors[color]}`}
      >
        {icon}
      </div>

      <div>

        <p className="text-sm text-gray-500">
          {label}
        </p>

        <p className="font-semibold break-words">
          {value || "Not Available"}
        </p>

      </div>

    </div>
  );
}

export default CitizenCard;