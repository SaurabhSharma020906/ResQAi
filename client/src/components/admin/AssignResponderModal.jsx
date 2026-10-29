import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Ambulance, Flame, Shield, Hospital, UserCheck, X, Loader2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function AssignResponderModal({ incident, onClose, onAssigned }) {
  const [responders, setResponders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadResponders = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE}/responders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResponders(response.data.responders || []);
      } catch (err) {
        console.error("Responder fetch failed:", err);
        setError(err.response?.data?.message || "Unable to load responders.");
      } finally {
        setLoading(false);
      }
    };
    loadResponders();
  }, []);

  const suggestedTypes = useMemo(() => {
    switch (incident?.emergencyType) {
      case "Medical": return ["Ambulance", "Hospital"];
      case "Fire": return ["Fire Brigade"];
      case "Crime": return ["Police"];
      case "Road Accident": return ["Ambulance", "Police"];
      default: return ["Ambulance", "Police", "Fire Brigade", "Hospital"];
    }
  }, [incident]);

  const available = responders.filter((r) => r.status === "Available");
  const suggested = available.filter((r) => suggestedTypes.includes(r.type));
  const list = suggested.length ? suggested : available;

  const icon = (type) => {
    if (type === "Ambulance") return <Ambulance className="text-red-600" />;
    if (type === "Police") return <Shield className="text-blue-600" />;
    if (type === "Fire Brigade") return <Flame className="text-orange-600" />;
    return <Hospital className="text-purple-600" />;
  };

  const assign = async (responder) => {
    try {
      setAssigning(responder._id);
      setError("");
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE}/responders/assign/${incident._id}`,
        { responderId: responder._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message || "Responder assigned successfully.");
      onAssigned?.(response.data.incident);
      onClose();
    } catch (err) {
      console.error("Assignment failed:", err);
      setError(err.response?.data?.message || "Responder assignment failed.");
    } finally {
      setAssigning(null);
    }
  };

  if (!incident) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-7 py-5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Assign Responder</h2>
            <p className="text-sm text-gray-500 mt-1">
              {incident.emergencyType} • {incident.severity} • {incident.priority} Priority
            </p>
          </div>
          <button onClick={onClose} className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200"><X /></button>
        </div>

        <div className="p-7">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-5">
            <p className="font-semibold text-blue-900">Recommended responder types</p>
            <p className="text-blue-700 text-sm mt-1">{suggestedTypes.join(" • ")}</p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-5">{error}</div>}

          {loading ? (
            <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={34} /></div>
          ) : list.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <UserCheck size={42} className="mx-auto mb-3 text-gray-300" />
              <p className="font-semibold">No available responders</p>
              <p className="text-sm mt-1">Add a responder from the Responders section and set its status to Available.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((responder) => (
                <div key={responder._id} className="border rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-slate-100">{icon(responder.type)}</div>
                    <div>
                      <p className="font-bold text-slate-800">{responder.name}</p>
                      <p className="text-sm text-gray-500">{responder.type} • {responder.phone || "No phone"}</p>
                      <span className="inline-block mt-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">Available</span>
                    </div>
                  </div>
                  <button
                    onClick={() => assign(responder)}
                    disabled={assigning === responder._id}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2"
                  >
                    {assigning === responder._id ? <Loader2 size={18} className="animate-spin" /> : <UserCheck size={18} />}
                    {assigning === responder._id ? "Assigning..." : "Assign"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AssignResponderModal;
