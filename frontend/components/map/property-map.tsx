"use client";

import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import type { PropertyListing } from "@/types";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function getMarkerColor(price: number) {
  if (price < 10_000_000) return "#22c55e";
  if (price < 20_000_000) return "#eab308";
  if (price < 40_000_000) return "#f97316";
  return "#ef4444";
}

function toPkNumber(value: number) {
  return new Intl.NumberFormat("en-PK").format(Math.round(value));
}

function aggregateByArea(properties: PropertyListing[]) {
  const byArea = new Map<string, { lat: number; lng: number; prices: number[] }>();

  properties.forEach((item) => {
    if (item.latitude == null || item.longitude == null) return;
    const key = item.location_area;
    const existing = byArea.get(key);
    if (existing) {
      existing.prices.push(item.price);
      return;
    }
    byArea.set(key, {
      lat: item.latitude,
      lng: item.longitude,
      prices: [item.price]
    });
  });

  return Array.from(byArea.entries()).map(([area, value]) => {
    const avgPrice = value.prices.reduce((sum, p) => sum + p, 0) / value.prices.length;
    return { area, lat: value.lat, lng: value.lng, avgPrice };
  });
}

type Props = {
  properties: PropertyListing[];
};

export function PropertyMap({ properties }: Props) {
  const points = properties.filter((item) => item.latitude != null && item.longitude != null);
  const center: [number, number] = points.length
    ? [points[0].latitude as number, points[0].longitude as number]
    : [31.5204, 74.3587];
  const areaHeat = aggregateByArea(points);

  return (
    <div className="panel p-0">
      <MapContainer center={center} zoom={11} className="h-[560px] w-full rounded-2xl">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {points.map((row) => (
          <Marker key={row.id} position={[row.latitude as number, row.longitude as number]} icon={icon}>
            <Popup>
              <div className="space-y-1 text-xs">
                <p className="font-semibold">{row.location_area}</p>
                <p>City: {row.city}</p>
                <p>Type: {row.property_type}</p>
                <p>Price: PKR {toPkNumber(row.price)}</p>
                <p>Area: {row.area_size_marla} marla</p>
                <p style={{ color: getMarkerColor(row.price) }}>Band: {row.price < 10_000_000 ? "Low" : row.price < 20_000_000 ? "Mid" : row.price < 40_000_000 ? "High" : "Premium"}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {areaHeat.map((item) => (
          <Circle
            key={item.area}
            center={[item.lat, item.lng]}
            radius={Math.max(250, Math.min(1200, item.avgPrice / 50_000))}
            pathOptions={{
              color: "#f97316",
              fillColor: "#f97316",
              fillOpacity: Math.max(0.2, Math.min(0.65, item.avgPrice / 80_000_000))
            }}
          >
            <Popup>
              <div className="space-y-1 text-xs">
                <p className="font-semibold">{item.area}</p>
                <p>Average Price: PKR {toPkNumber(item.avgPrice)}</p>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
}
