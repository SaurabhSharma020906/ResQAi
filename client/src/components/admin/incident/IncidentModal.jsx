import { useEffect } from "react";
import { X } from "lucide-react";

import useIncidentActions from "./hooks/useIncidentActions";

import CitizenCard from "./CitizenCard";
import IncidentCard from "./IncidentCard";
import IncidentMap from "./IncidentMap";
import AIRecommendation from "./AIRecommendation";
import UploadedImage from "./UploadedImage";
import NearbyServices from "./NearbyServices";
import StatusPanel from "./StatusPanel";
import Timeline from "./Timeline";
import RespondersCard from "./RespondersCard";
import ActivityLog from "./ActivityLog";

function IncidentModal({
  incident,
  onClose,
  refreshIncidents,
  setSelectedIncident,
}) {
  const {
    nearbyServices,
    loadingServices,
    dispatching,
    updatingStatus,
    fetchNearbyServices,
    dispatchService,
    updateStatus,
  } = useIncidentActions(
    incident,
    refreshIncidents,
    setSelectedIncident
  );

  useEffect(() => {
    if (incident) {
      fetchNearbyServices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incident]);

  if (!incident) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">

        {/* Header */}

        <div className="sticky top-0 bg-white border-b px-8 py-6 flex justify-between items-center z-30">

          <div>

            <h2 className="text-3xl font-bold text-slate-800">
              🚨 Incident Control Center
            </h2>

            <p className="text-gray-500 mt-1">
              Incident ID : {incident._id}
            </p>

          </div>

          <button
            onClick={onClose}
            className="bg-red-100 hover:bg-red-200 transition p-3 rounded-xl"
          >
            <X size={22} />
          </button>

        </div>

        {/* Main */}

        <div className="grid lg:grid-cols-2 gap-8 p-8">

          {/* LEFT */}

          <div className="space-y-6">

            <CitizenCard incident={incident} />

            <IncidentCard incident={incident} />

            {/* NEW MAP */}

            <IncidentMap
              incident={incident}
              services={nearbyServices}
            />

            <AIRecommendation incident={incident} />

            <UploadedImage incident={incident} />

          </div>

          {/* RIGHT */}

          <div className="space-y-6">

            <StatusPanel
              key={`${incident._id}-${incident.status}`}
              incident={incident}
              updateStatus={updateStatus}
              updatingStatus={updatingStatus}
            />

            <NearbyServices
              services={nearbyServices}
              loading={loadingServices}
              dispatching={dispatching}
              dispatchService={dispatchService}
            />

            <RespondersCard incident={incident} />

            <Timeline incident={incident} />

            <ActivityLog incident={incident} />

          </div>

        </div>

        {/* Footer */}

        <div className="sticky bottom-0 bg-white border-t px-8 py-5 flex justify-end">

          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-xl font-semibold transition"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}

export default IncidentModal;