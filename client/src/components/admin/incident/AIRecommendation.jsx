import {
  Brain,
  AlertTriangle,
  Ambulance,
  Timer,
  ShieldCheck,
} from "lucide-react";

function AIRecommendation({ incident }) {
  if (!incident) return null;

  const severityColor = {
    Low: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    High: "bg-orange-100 text-orange-700",
    Critical: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

      {/* Header */}

      <div className="bg-violet-600 text-white px-6 py-4">

        <h2 className="text-xl font-bold flex items-center gap-2">
          <Brain size={20} />
          AI Analysis
        </h2>

      </div>

      <div className="p-6 space-y-6">

        {/* Severity */}

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-2">

            <AlertTriangle size={18} />

            <span className="font-medium">
              Predicted Severity
            </span>

          </div>

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

          <div className="flex items-center gap-2">

            <ShieldCheck size={18} />

            <span className="font-medium">
              Priority
            </span>

          </div>

          <span className="font-semibold text-blue-600">
            {incident.priority || "Not Assigned"}
          </span>

        </div>

        {/* Estimated Response */}

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-2">

            <Timer size={18} />

            <span className="font-medium">
              Estimated Response
            </span>

          </div>

          <span className="font-semibold">
            {incident.estimatedResponseTime ||
              "Calculating..."}
          </span>

        </div>

        {/* Dispatch Recommendation */}

        <div>

          <div className="flex items-center gap-2 mb-3">

            <Ambulance size={18} />

            <span className="font-medium">
              Recommended Dispatch
            </span>

          </div>

          {incident.dispatchServices?.length ? (

            <div className="flex flex-wrap gap-3">

              {incident.dispatchServices.map(
                (service) => (
                  <span
                    key={service}
                    className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold"
                  >
                    {service}
                  </span>
                )
              )}

            </div>

          ) : (

            <div className="bg-slate-50 border rounded-xl p-4 text-gray-500">

              No AI recommendation available.

            </div>

          )}

        </div>

        {/* AI Summary */}

        <div className="bg-violet-50 border border-violet-200 rounded-xl p-5">

          <h3 className="font-bold mb-2 text-violet-700">

            AI Summary

          </h3>

          <p className="leading-relaxed text-gray-700">

            Based on the reported emergency,
            the AI has classified this incident
            as

            <strong> {incident.severity}</strong>

            {" "}priority.

            {incident.dispatchServices?.length > 0 &&
              ` Recommended emergency response includes ${incident.dispatchServices.join(
                ", "
              )}.`}

          </p>

        </div>

      </div>

    </div>
  );
}

export default AIRecommendation;