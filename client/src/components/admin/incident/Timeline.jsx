import {
  Clock,
  FileText,
  Ambulance,
  Users,
  CheckCircle2,
} from "lucide-react";

function Timeline({ incident }) {
  if (!incident) return null;

  const formatDate = (date) => {
    if (!date) return null;

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const events = [];

  // Incident Reported
  events.push({
    icon: <FileText size={18} />,
    title: "Incident Reported",
    description: `${incident.fullName} reported a ${incident.emergencyType} emergency.`,
    time: incident.createdAt,
    color: "bg-blue-500",
  });

  // Service Dispatched
  if (incident.dispatchedService?.dispatchedAt) {
    events.push({
      icon: <Ambulance size={18} />,
      title: "Emergency Service Dispatched",
      description:
        incident.dispatchedService.name ||
        incident.dispatchedService.type ||
        "Emergency Service",
      time: incident.dispatchedService.dispatchedAt,
      color: "bg-purple-500",
    });
  }

  // Responders Assigned
  incident.assignedResponders?.forEach((responder) => {
    if (responder.assignedAt) {
      events.push({
        icon: <Users size={18} />,
        title: "Responder Assigned",
        description:
          responder.responderType || "Emergency Responder",
        time: responder.assignedAt,
        color: "bg-orange-500",
      });
    }
  });

  // Current Status
  events.push({
    icon: <CheckCircle2 size={18} />,
    title: `Status: ${incident.status}`,
    description: "Latest incident status.",
    time: incident.updatedAt,
    color:
      incident.status === "Resolved"
        ? "bg-green-600"
        : incident.status === "Cancelled"
        ? "bg-red-600"
        : "bg-indigo-600",
  });

  events.sort(
    (a, b) => new Date(a.time) - new Date(b.time)
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

      {/* Header */}

      <div className="bg-slate-800 text-white px-6 py-4">

        <h2 className="text-xl font-bold flex items-center gap-2">
          <Clock size={20} />
          Incident Timeline
        </h2>

      </div>

      <div className="p-6">

        <div className="relative border-l-2 border-slate-300 ml-5">

          {events.map((event, index) => (

            <div
              key={index}
              className="relative mb-8 pl-8"
            >

              <div
                className={`absolute -left-[14px] w-7 h-7 rounded-full text-white flex items-center justify-center ${event.color}`}
              >
                {event.icon}
              </div>

              <div className="bg-slate-50 rounded-xl border p-4">

                <div className="flex justify-between items-start flex-wrap gap-2">

                  <h3 className="font-bold text-lg">
                    {event.title}
                  </h3>

                  <span className="text-sm text-gray-500">
                    {formatDate(event.time)}
                  </span>

                </div>

                <p className="mt-2 text-gray-600">
                  {event.description}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default Timeline;