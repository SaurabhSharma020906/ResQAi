
import { useState } from "react";
import { reportIncident } from "../services/incidentService";

function ReportIncident() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    emergencyType: "",
    description: "",
    latitude: "",
    longitude: "",
    address: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        let address = "";
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          address = data.display_name || "";
        } catch (error) {
          console.warn("Reverse geocoding failed", error);
        }
        setForm(f => ({
          ...f,
          latitude: lat.toString(),
          longitude: lng.toString(),
          address
        }));
      },
      () => alert("Unable to get location"),
      { enableHighAccuracy: true }
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v])=>{ if(v!==undefined) fd.append(k,v);});
      if(image) fd.append("image", image);
      const res = await reportIncident(fd);
      alert("Emergency reported successfully!");
      console.log(res);
      setForm({
        fullName:"",
        phone:"",
        emergencyType:"",
        description:"",
        latitude:"",
        longitude:"",
        address:"",
      });
      setImage(null);
      setPreview("");
    } catch(err){
      alert(err?.response?.data?.message || "Failed to report incident");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-6">🚨 Report Emergency</h1>
        <form onSubmit={submit} className="space-y-4">
          <input className="w-full border p-3 rounded" name="fullName" placeholder="Full Name" value={form.fullName} onChange={update} required/>
          <input className="w-full border p-3 rounded" name="phone" placeholder="Phone Number" value={form.phone} onChange={update} required/>
          <input className="w-full border p-3 rounded bg-gray-100" value={form.address} readOnly placeholder="Address"/>
          <div className="grid grid-cols-2 gap-3">
            <input className="border p-3 rounded bg-gray-100" value={form.latitude} readOnly placeholder="Latitude"/>
            <input className="border p-3 rounded bg-gray-100" value={form.longitude} readOnly placeholder="Longitude"/>
          </div>
          <button type="button" onClick={getLocation} className="w-full bg-blue-600 text-white p-3 rounded">📍 Get Current Location</button>
          <select
  className="w-full border p-3 rounded"
  name="emergencyType"
  value={form.emergencyType}
  onChange={update}
  required
>
  <option value="">Select Emergency Type</option>
  <option value="Road Accident">Road Accident</option>
  <option value="Medical">Medical</option>
  <option value="Fire">Fire</option>
  <option value="Crime">Crime</option>
  <option value="Natural Disaster">Natural Disaster</option>
  <option value="Other">Other</option>
</select>
          <textarea className="w-full border p-3 rounded" rows="5" name="description" value={form.description} onChange={update} placeholder="Describe the incident" required/>
          <input type="file" accept="image/*" className="w-full border p-3 rounded" onChange={e=>{const f=e.target.files[0]; setImage(f); if(f) setPreview(URL.createObjectURL(f));}}/>
          {preview && <img src={preview} alt="preview" className="w-full h-72 object-cover rounded"/>}
          <button disabled={loading} className="w-full bg-red-600 text-white p-4 rounded font-semibold">
            {loading ? "Submitting..." : "🚑 Submit Emergency Report"}
          </button>
        </form>
      </div>
    </div>
  );
}
export default ReportIncident;
