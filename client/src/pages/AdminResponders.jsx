import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Plus, RefreshCw, Trash2, UserRoundCheck } from "lucide-react";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const emptyForm = {
  name: "",
  type: "Ambulance",
  latitude: "19.0760",
  longitude: "72.8777",
  phone: "",
  address: "Mumbai",
  status: "Available",
};

export default function AdminResponders() {
  const [responders, setResponders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const auth = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/responders`, auth());
      setResponders(res.data.responders || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load responders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const createResponder = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await axios.post(`${API_BASE}/responders`, form, auth());
      setForm(emptyForm);
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add responder.");
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE}/responders/${id}/status`, { status }, auth());
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update responder.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this responder?")) return;
    try {
      await axios.delete(`${API_BASE}/responders/${id}`, auth());
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete responder.");
    }
  };

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <AdminHeader user={{ name: "Administrator", role: "Admin" }} />
        <div className="flex items-center justify-between mt-6 mb-5">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Responder Management</h2>
            <p className="text-slate-500 mt-1">Add emergency responders and control their availability.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={load} className="px-4 py-3 rounded-xl bg-white border hover:bg-slate-50"><RefreshCw size={18} className="inline mr-2" />Refresh</button>
            <button onClick={() => setShowForm((v) => !v)} className="px-4 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700"><Plus size={18} className="inline mr-2" />Add Responder</button>
          </div>
        </div>

        {error && <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200">{error}</div>}

        {showForm && (
          <form onSubmit={createResponder} className="bg-white rounded-2xl shadow-sm border p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <h3 className="md:col-span-2 text-xl font-bold">Add Emergency Responder</h3>
            <input required placeholder="Responder name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded-xl p-3" />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="border rounded-xl p-3">
              <option>Ambulance</option><option>Hospital</option><option>Fire Brigade</option><option>Police</option>
            </select>
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border rounded-xl p-3" />
            <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="border rounded-xl p-3" />
            <input required type="number" step="any" placeholder="Latitude" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} className="border rounded-xl p-3" />
            <input required type="number" step="any" placeholder="Longitude" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} className="border rounded-xl p-3" />
            <div className="md:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-3 rounded-xl border">Cancel</button>
              <button disabled={saving} className="px-5 py-3 rounded-xl bg-red-600 text-white">{saving ? "Saving..." : "Create Responder"}</button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          {loading ? <div className="p-10 text-center">Loading responders...</div> : responders.length === 0 ? (
            <div className="p-12 text-center text-slate-500"><UserRoundCheck size={42} className="mx-auto mb-3 text-slate-300" /><p className="font-semibold">No responders found</p><p>Add an Ambulance, Police, Fire Brigade or Hospital responder.</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b"><tr><th className="p-4">Name</th><th className="p-4">Type</th><th className="p-4">Phone</th><th className="p-4">Online</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead>
                <tbody>
                  {responders.map((r) => (
                    <tr key={r._id} className="border-b last:border-0">
                      <td className="p-4 font-semibold">{r.name}</td><td className="p-4">{r.type}</td><td className="p-4">{r.phone || "—"}</td>
                      <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs ${r.isOnline ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>{r.isOnline ? "Online" : "Offline"}</span></td>
                      <td className="p-4"><select value={r.status} onChange={(e) => changeStatus(r._id, e.target.value)} className="border rounded-lg p-2"><option>Available</option><option>Busy</option><option>Offline</option></select></td>
                      <td className="p-4"><button onClick={() => remove(r._id)} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="Delete"><Trash2 size={18} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
