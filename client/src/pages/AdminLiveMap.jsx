import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import L from "leaflet";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const responderIcon = new L.DivIcon({ className: "resqai-marker", html: '<div style="background:#2563eb;color:white;border:3px solid white;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px #0005">🚑</div>', iconSize: [34,34], iconAnchor: [17,17] });

export default function AdminLiveMap() {
  const [incidents, setIncidents] = useState([]);
  const [responders, setResponders] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [ir, rr] = await Promise.all([axios.get(`${API_BASE}/incidents/all`, { headers }), axios.get(`${API_BASE}/responders`, { headers })]);
      setIncidents(ir.data.incidents || []); setResponders(rr.data.responders || []);
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); const t=setInterval(load,10000); return()=>clearInterval(t); }, [load]);
  const points = incidents.filter(i => Number.isFinite(Number(i.latitude)) && Number.isFinite(Number(i.longitude)));
  const center = points.length ? [Number(points[0].latitude), Number(points[0].longitude)] : [19.076,72.8777];
  return <div className="flex bg-slate-100 min-h-screen"><AdminSidebar /><main className="flex-1 p-8 overflow-auto"><AdminHeader user={{ name:"Administrator", role:"Admin" }} /><div className="mt-6 flex items-center justify-between"><div><h2 className="text-3xl font-bold">Live Map</h2><p className="text-slate-500 mt-1">Incident and responder locations refresh automatically.</p></div><button onClick={load} className="px-4 py-3 bg-white border rounded-xl">Refresh</button></div><div className="mt-6 bg-white rounded-2xl border overflow-hidden" style={{height:"650px"}}>{loading?<div className="h-full flex items-center justify-center">Loading map...</div>:<MapContainer center={center} zoom={11} style={{height:"100%",width:"100%"}}><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{points.map(i=><CircleMarker key={i._id} center={[Number(i.latitude),Number(i.longitude)]} radius={9} pathOptions={{color:i.severity==="Critical"?"#dc2626":i.severity==="High"?"#f97316":"#eab308",fillOpacity:.8}}><Popup><b>{i.emergencyType}</b><br/>Severity: {i.severity}<br/>Status: {i.status}<br/>{i.address||"Location reported"}</Popup></CircleMarker>)}{responders.filter(r=>Number.isFinite(Number(r.currentLatitude??r.latitude))&&Number.isFinite(Number(r.currentLongitude??r.longitude))).map(r=><Marker key={r._id} position={[Number(r.currentLatitude??r.latitude),Number(r.currentLongitude??r.longitude)]} icon={responderIcon}><Popup><b>{r.name}</b><br/>{r.type}<br/>Status: {r.status}</Popup></Marker>)}</MapContainer>}</div></main></div>;
}
