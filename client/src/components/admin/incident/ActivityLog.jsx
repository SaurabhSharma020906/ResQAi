import {
  History,
  Clock,
  CheckCircle,
  AlertTriangle,
  Truck,
  UserCheck,
} from "lucide-react";

function ActivityLog({ incident }) {
  if (!incident) return null;

  const logs =
    incident.activityLog ||
    incident.logs ||
    incident.history ||
    [];

  const formatDate = (date) => {
    if (!date) return "Unknown Time";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getIcon = (action = "") => {
    const value = action.toLowerCase();

    if (value.includes("dispatch"))
      return (
        <Truck
          size={18}
          className="text-blue-600"
        />
      );

    if (value.includes("status"))
      return (
        <CheckCircle
          size={18}
          className="text-green-600"
        />
      );

    if (value.includes("assign"))
      return (
        <UserCheck
          size={18}
          className="text-purple-600"
        />
      );

    return (
      <AlertTriangle
        size={18}
        className="text-red-600"
      />
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

      {/* Header */}

      <div className="bg-slate-800 text-white px-6 py-4">

        <h2 className="text-xl font-bold flex items-center gap-2">

          <History size={22} />

          Activity Log

        </h2>

      </div>

      <div className="p-6">

        {logs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">

            No activity recorded yet.

          </div>
        ) : (
          <div className="space-y-5">

            {logs.map((log, index) => (
              <div
                key={log._id || index}
                className="flex gap-4 border-b last:border-none pb-4"
              >
                <div className="bg-slate-100 rounded-full p-3 h-fit">

                  {getIcon(log.action)}

                </div>

                <div className="flex-1">

                  <h3 className="font-semibold">

                    {log.action || "Activity"}

                  </h3>

                  {log.description && (
                    <p className="text-gray-600 mt-1">

                      {log.description}

                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">

                    <div className="flex items-center gap-1">

                      <Clock size={15} />

                      {formatDate(
                        log.createdAt || log.time
                      )}

                    </div>

                    {log.user && (
                      <div>

                        By:{" "}
                        <span className="font-medium">

                          {log.user}

                        </span>

                      </div>
                    )}

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

export default ActivityLog;