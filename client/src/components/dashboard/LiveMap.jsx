import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { markerIcons } from "./markerIcons";
import IncidentPopup from "./IncidentPopup";

function LiveMap({ incidents = [] }) {
  const defaultCenter = [19.076, 72.8777];

  const center =
    incidents.length > 0
      ? [
          Number(incidents[0].latitude),
          Number(incidents[0].longitude),
        ]
      : defaultCenter;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-4">
        🗺️ Live Emergency Map
      </h2>

      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom
        className="rounded-xl"
        style={{
          height: "550px",
          width: "100%",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {incidents.map((incident) => (
          <Marker
            key={incident._id}
            position={[
              Number(incident.latitude),
              Number(incident.longitude),
            ]}
            icon={
              markerIcons[incident.emergencyType] ||
              markerIcons.Other
            }
          >
            <Popup>
              <IncidentPopup incident={incident} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

    </div>
  );
}

export default LiveMap;