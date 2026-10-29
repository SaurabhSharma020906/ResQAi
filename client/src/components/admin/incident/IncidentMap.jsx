import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  ScaleControl,
  Circle,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import {
  MapPin,
  Navigation,
  Copy,
  ExternalLink,
  Clock3,
  Route,
  Wifi,
  WifiOff,
} from "lucide-react";

import "leaflet/dist/leaflet.css";

import { useSocket } from "../../../socket";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const incidentIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const hospitalIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const policeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const fireIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const responderIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [28, 45],
  iconAnchor: [14, 45],
});

function AutoFitBounds({
  incident,
  services,
  responders,
  route,
}) {
  const map = useMap();

  useEffect(() => {
    if (!incident) return;

    const bounds = [];

    bounds.push([
      Number(incident.latitude),
      Number(incident.longitude),
    ]);

    services.forEach((service) => {
      if (service.latitude && service.longitude) {
        bounds.push([
          Number(service.latitude),
          Number(service.longitude),
        ]);
      }
    });

    responders.forEach((r) => {
      if (
        r.currentLatitude &&
        r.currentLongitude
      ) {
        bounds.push([
          Number(r.currentLatitude),
          Number(r.currentLongitude),
        ]);
      }
    });

    route.forEach((p) => bounds.push(p));

    if (bounds.length) {
      map.fitBounds(bounds, {
        padding: [60, 60],
      });
    }
  }, [
    incident,
    services,
    responders,
    route,
    map,
  ]);

  return null;
}

function IncidentMap({
  incident,
  services = [],
}) {

  const socket = useSocket();

  const lat = Number(incident?.latitude);
  const lng = Number(incident.longitude);

  const [route, setRoute] =
    useState([]);

  const [distance, setDistance] =
    useState(null);

  const [duration, setDuration] =
    useState(null);

  const [responders, setResponders] =
    useState([]);

  const dispatchedService = useMemo(() => {

    if (!incident.dispatchedService)
      return null;

    return services.find(
      (s) =>
        s._id ===
          incident.dispatchedService ||
        s.id ===
          incident.dispatchedService
    );

  }, [incident, services]);

  // =====================================
  // Socket Events
  // =====================================

  useEffect(() => {

    if (!socket) return;

    socket.on(
      "responder-location-updated",
      (responder) => {

        setResponders((prev) => {

          const index = prev.findIndex(
            (r) =>
              r._id === responder._id
          );

          if (index === -1)
            return [...prev, responder];

          const copy = [...prev];

          copy[index] = responder;

          return copy;

        });

      }
    );

    socket.on(
      "responder-online",
      ({ responderId }) => {

        setResponders((prev) =>
          prev.map((r) =>
            r._id === responderId
              ? {
                  ...r,
                  isOnline: true,
                }
              : r
          )
        );

      }
    );

    socket.on(
      "responder-offline",
      ({ responderId }) => {

        setResponders((prev) =>
          prev.map((r) =>
            r._id === responderId
              ? {
                  ...r,
                  isOnline: false,
                }
              : r
          )
        );

      }
    );

    return () => {

      socket.off(
        "responder-location-updated"
      );

      socket.off(
        "responder-online"
      );

      socket.off(
        "responder-offline"
      );

    };

  }, [socket]);

  useEffect(() => {

    async function loadRoute() {

      if (!dispatchedService) {

        setRoute([]);

        setDistance(null);

        setDuration(null);

        return;

      }

      const url =
        `https://router.project-osrm.org/route/v1/driving/${dispatchedService.longitude},${dispatchedService.latitude};${lng},${lat}?overview=full&geometries=geojson`;

      try {

        const res = await fetch(url);

        const data = await res.json();

        if (!data.routes?.length)
          return;

        const r = data.routes[0];

        setDistance(
          (r.distance / 1000).toFixed(2)
        );

        setDuration(
          Math.round(r.duration / 60)
        );

        setRoute(
          r.geometry.coordinates.map(
            ([x, y]) => [y, x]
          )
        );

      } catch (err) {

        console.error(err);

      }

    }

    loadRoute();

  }, [
    dispatchedService,
    lat,
    lng,
  ]);

  if (!incident) return null;

  const googleMaps =
    `https://www.google.com/maps?q=${lat},${lng}`;

  const copyCoordinates = () =>
    navigator.clipboard.writeText(
      `${lat},${lng}`
    );

  const getIcon = (
    type = ""
  ) => {

    const value =
      type.toLowerCase();

    if (
      value.includes("police")
    )
      return policeIcon;

    if (
      value.includes("fire")
    )
      return fireIcon;

    return hospitalIcon;

  };
  return (
  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

    {/* Header */}

    <div className="bg-emerald-600 text-white px-6 py-4 flex items-center justify-between">

      <div className="flex items-center gap-2">
        <MapPin size={20} />
        <h2 className="text-xl font-bold">
          Live Dispatch Map
        </h2>
      </div>

      {distance && duration && (
        <div className="flex gap-6 text-sm">

          <div className="flex items-center gap-2">
            <Route size={16} />
            {distance} km
          </div>

          <div className="flex items-center gap-2">
            <Clock3 size={16} />
            {duration} min
          </div>

        </div>
      )}

    </div>

    {/* Map */}

    <div className="h-[520px]">

      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom
        style={{
          width: "100%",
          height: "100%",
        }}
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ScaleControl position="bottomleft" />

        <AutoFitBounds
          incident={incident}
          services={services}
          responders={responders}
          route={route}
        />

        {/* ========================= */}
        {/* Incident */}
        {/* ========================= */}

        <Marker
          position={[lat, lng]}
          icon={incidentIcon}
        >

          <Popup>

            <div className="space-y-2">

              <h3 className="font-bold text-red-600">
                🚨 Emergency Incident
              </h3>

              <p>
                <strong>Type:</strong>{" "}
                {incident.emergencyType}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {incident.status}
              </p>

              <p>
                <strong>Severity:</strong>{" "}
                {incident.severity}
              </p>

              <p className="text-sm">
                {incident.address}
              </p>

            </div>

          </Popup>

        </Marker>

        {/* ========================= */}
        {/* Nearby Services */}
        {/* ========================= */}

        {services.map((service, index) => (

          <Marker
            key={service._id || service.id || index}
            position={[
              Number(service.latitude),
              Number(service.longitude),
            ]}
            icon={getIcon(service.type)}
          >

            <Popup>

              <div className="space-y-2">

                <h3 className="font-bold text-blue-700">
                  {service.name}
                </h3>

                <p>
                  <strong>Type:</strong>{" "}
                  {service.type}
                </p>

                <p className="text-sm">
                  {service.address}
                </p>

                <p className="font-semibold text-green-600">
                  📍{" "}
                  {Number(
                    service.distance || 0
                  ).toFixed(2)}
                  km away
                </p>

              </div>

            </Popup>

          </Marker>

        ))}

        {/* ========================= */}
        {/* Live Responders */}
        {/* ========================= */}

        {responders.map((responder) => {

          if (
            responder.currentLatitude == null ||
            responder.currentLongitude == null
          ) {
            return null;
          }

          return (
            <>

              <Circle
                key={`${responder._id}-circle`}
                center={[
                  responder.currentLatitude,
                  responder.currentLongitude,
                ]}
                radius={
                  responder.accuracy || 15
                }
                pathOptions={{
                  color: "#7c3aed",
                  fillOpacity: 0.12,
                }}
              />

              <Marker
                key={responder._id}
                position={[
                  responder.currentLatitude,
                  responder.currentLongitude,
                ]}
                icon={responderIcon}
              >

                <Popup>

                  <div className="space-y-2 min-w-[240px]">

                    <h3 className="font-bold text-violet-700">
                      🚑 {responder.name}
                    </h3>

                    <p>
                      <strong>Type:</strong>{" "}
                      {responder.type}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      {responder.status}
                    </p>

                    <p>
                      <strong>Speed:</strong>{" "}
                      {Number(
                        responder.speed || 0
                      ).toFixed(1)}
                      km/h
                    </p>

                    <p>
                      <strong>Heading:</strong>{" "}
                      {Number(
                        responder.heading || 0
                      ).toFixed(0)}
                      °
                    </p>

                    <div className="flex items-center gap-2">

                      {responder.isOnline ? (
                        <>
                          <Wifi
                            size={16}
                            className="text-green-600"
                          />
                          <span className="text-green-600 font-semibold">
                            Online
                          </span>
                        </>
                      ) : (
                        <>
                          <WifiOff
                            size={16}
                            className="text-red-600"
                          />
                          <span className="text-red-600 font-semibold">
                            Offline
                          </span>
                        </>
                      )}

                    </div>

                  </div>

                </Popup>

              </Marker>

            </>
          );

        })}

        {/* ========================= */}
        {/* Route */}
        {/* ========================= */}

        {route.length > 0 && (

          <Polyline
            positions={route}
            pathOptions={{
              color: "#2563eb",
              weight: 6,
              opacity: 0.85,
            }}
          />

        )}

      </MapContainer>

    </div>

    {/* Footer */}

    <div className="bg-slate-50 border-t p-5">

      <div className="flex flex-wrap gap-3 items-center">

        <button
          onClick={copyCoordinates}
          className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 transition px-4 py-2 rounded-lg"
        >
          <Copy size={16} />
          Copy Coordinates
        </button>

        <a
          href={googleMaps}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition px-4 py-2 rounded-lg"
        >
          <ExternalLink size={16} />
          Open in Google Maps
        </a>

        <div className="ml-auto flex items-center gap-5 text-gray-600">

          <div className="flex items-center gap-2">
            <Navigation size={18} />
            {services.length} Services
          </div>

          <div className="flex items-center gap-2">
            <Wifi size={18} />
            {responders.filter(r => r.isOnline).length}
            {" "}Online
          </div>

        </div>

      </div>

    </div>

  </div>
);

}

export default IncidentMap;