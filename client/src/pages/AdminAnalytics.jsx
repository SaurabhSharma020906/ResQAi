import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminAnalytics() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/incidents/all`, { headers: { Authorization: `Bearer ${token}` } });
      setIncidents(res.data.incidents || []);
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  const stats = useMemo(() => ({
    total: incidents.length,
    critical: incidents.filter(i => i.severity === "Critical").length,
    high: incidents.filter(i => i.severity === "High").length,
    medium: incidents.filter(i => i.severity === "Medium").length,
    pending: incidents.filter(i => i.status === "Pending").length,
    assigned: incidents.filter(i => i.status === "Assigned").length,
    resolved: incidents.filter(i => i.status === "Resolved").length,
  }), [incidents]);
  return <div className="flex bg-slate-100 min-h-screen"><AdminSidebar /><main className="flex-1 p-8 overflow-auto"><AdminHeader user={{ name: "Administrator", role: "Admin" }} /><div className="mt-6"><h2 className="text-3xl font-bold">Analytics</h2><p className="text-slate-500 mt-1">Emergency incident statistics and response overview.</p></div>{loading ? <div className="mt-8 bg-white rounded-2xl p-10 text-center">Loading analytics...</div> : <><div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-6">{[["Total Incidents",stats.total,"bg-red-600"],["Critical",stats.critical,"bg-red-500"],["Pending",stats.pending,"bg-amber-500"],["Resolved",stats.resolved,"bg-green-600"]].map(([label,value,color])=><div key={label} className={`${color} text-white rounded-2xl p-6 shadow-sm`}><p className="opacity-80">{label}</p><p className="text-4xl font-bold mt-2">{value}</p></div>)}</div><div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"><div className="bg-white rounded-2xl p-6 border"><h3 className="text-xl font-bold mb-5">Severity Distribution</h3>{[["Critical",stats.critical,"bg-red-500"],["High",stats.high,"bg-orange-500"],["Medium",stats.medium,"bg-yellow-500"]].map(([label,value,color])=><div key={label} className="mb-5"><div className="flex justify-between mb-2"><span>{label}</span><b>{value}</b></div><div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className={`${color} h-full rounded-full`} style={{ width: `${stats.total ? Math.max(3, value/stats.total*100) : 0}%` }} /></div></div>)}</div><div className="bg-white rounded-2xl p-6 border"><h3 className="text-xl font-bold mb-5">Status Overview</h3>{[["Pending",stats.pending],["Assigned",stats.assigned],["Resolved",stats.resolved]].map(([label,value])=><div key={label} className="flex justify-between border-b py-4 last:border-0"><span>{label}</span><b>{value}</b></div>)}</div></div></>}</main></div>;
}
