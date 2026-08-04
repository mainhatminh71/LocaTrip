import MapboxMap from "@/components/MapboxMap";

export const metadata = {
  title: "Bản đồ | LocaTrip",
  description: "Bản đồ Đà Lạt trên Mapbox",
};

export default function MapPage() {
  return (
    <main style={{ height: "100vh", width: "100%", margin: 0 }}>
      <MapboxMap className="h-full w-full" />
    </main>
  );
}
