import {
  Ambulance,
  Shield,
  Flame,
  User,
  Clock,
  Navigation,
} from "lucide-react";

function RespondersCard({ incident }) {
  if (!incident) return null;

  const responders = incident.assignedResponders || [];

  const getIcon = (type = "") => {
    switch (type.toLowerCase()) {
      case "ambulance":
        return <Ambulance className="text-red-600" size={22} />;

      case "police":
        return <Shield className="text-blue-600" size={22} />;

      case "fire":
        return <Flame className="text-orange-600" size={22} />;

      default:
        return <User className="text-slate-600" size={22} />;
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

      {/* Header */}

      <div className="bg-indigo-600 text-white px-6 py-4">
        <h2 className="text-xl font-bold">
          Assigned Responders
        </h2>
      </div>

      <div className="p-6">

        {responders.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No responders assigned yet.
          </div>
        ) : (
          <div className="space-y-5">

            {responders.map((item, index) => (

              <div
                key={index}
                className="border rounded-2xl p-5 hover:shadow-md transition"
              >
                <div className="flex justify-between">

                  <div className="flex gap-4">

                    <div className="bg-slate-100 w-12 h-12 rounded-xl flex items-center justify-center">
                      {getIcon(item.responderType)}
                    </div>

                    <div>

                      <h3 className="font-bold text-lg">
                        {item.responder?.name ||
                          "Responder"}
                      </h3>

                      <p className="text-gray-500">
                        {item.responderType}
                      </p>

                      {item.responder?.phone && (
                        <p className="text-sm mt-2">
                          📞 {item.responder.phone}
                        </p>
                      )}

                    </div>

                  </div>

                  <div className="text-right">

                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Assigned
                    </div>

                  </div>

                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-5">

                  <div className="flex items-center gap-2 text-gray-600">

                    <Navigation size={17} />

                    Distance :
                    <strong>
                      {item.distance?.toFixed(2)} km
                    </strong>

                  </div>

                  <div className="flex items-center gap-2 text-gray-600">

                    <Clock size={17} />

                    {formatDate(item.assignedAt)}

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

export default RespondersCard;