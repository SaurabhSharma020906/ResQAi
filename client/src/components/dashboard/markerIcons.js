import L from "leaflet";

const shadow =
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png";

const createIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

export const markerIcons = {
  Medical: createIcon("blue"),
  Fire: createIcon("red"),
  "Road Accident": createIcon("orange"),
  Crime: createIcon("black"),
  "Natural Disaster": createIcon("violet"),
  Flood: createIcon("green"),
  Earthquake: createIcon("gold"),
  Other: createIcon("grey"),
};