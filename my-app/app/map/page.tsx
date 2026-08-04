import { MapboxMap } from "@/components/map";

export const metadata = {
  title: "Bản đồ | LocaTrip",
  description: "Bản đồ Đà Lạt trên Mapbox",
};

export default function MapPage() {
  return (
    <main className="h-screen w-full">
      <MapboxMap className="h-full w-full" />
    </main>
  );
}
