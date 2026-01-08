import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { MapPin, LocateFixed, X, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultCenter: [number, number] = [38.7223, -9.1393];

const tileLayers = {
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
  },
};

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapPickerProps {
  latitude?: number | null;
  longitude?: number | null;
  onChange: (lat: number | null, lng: number | null) => void;
}

function MapClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function LocateControl({ onLocate }: { onLocate: (lat: number, lng: number) => void }) {
  const map = useMap();
  
  const handleLocate = () => {
    map.locate({ setView: true, maxZoom: 16 });
    map.once("locationfound", (e) => {
      onLocate(e.latlng.lat, e.latlng.lng);
    });
  };

  return (
    <div className="leaflet-top leaflet-right" style={{ top: 10, right: 10 }}>
      <Button
        type="button"
        size="icon"
        variant="secondary"
        className="shadow-md"
        onClick={handleLocate}
        data-testid="button-locate-me"
      >
        <LocateFixed className="w-4 h-4" />
      </Button>
    </div>
  );
}

function CenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
}

export function MapPicker({ latitude, longitude, onChange }: MapPickerProps) {
  const [open, setOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapType, setMapType] = useState<"street" | "satellite">("street");

  const hasLocation = latitude !== null && latitude !== undefined && longitude !== null && longitude !== undefined;
  
  const currentMarker = tempLocation ?? (hasLocation ? { lat: latitude!, lng: longitude! } : null);
  const displayCenter: [number, number] = currentMarker ? [currentMarker.lat, currentMarker.lng] : defaultCenter;

  const handleLocationChange = (lat: number, lng: number) => {
    setTempLocation({ lat, lng });
  };

  const handleConfirm = () => {
    if (currentMarker) {
      onChange(currentMarker.lat, currentMarker.lng);
    }
    setOpen(false);
  };

  const handleClear = () => {
    onChange(null, null);
    setTempLocation(null);
    setOpen(false);
  };

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTempLocation(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start text-left rounded-xl"
          data-testid="button-open-map-picker"
        >
          <MapPin className="w-4 h-4 mr-2 text-primary" />
          {hasLocation ? (
            <span className="truncate">
              {latitude!.toFixed(5)}, {longitude!.toFixed(5)}
            </span>
          ) : (
            <span className="text-muted-foreground">Selecionar localização no mapa</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="text-lg font-display text-primary">Selecionar Localização</DialogTitle>
        </DialogHeader>
        
        <div className="h-[50vh] relative">
          <MapContainer
            center={displayCenter}
            zoom={hasLocation ? 14 : 10}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              key={mapType}
              attribution={tileLayers[mapType].attribution}
              url={tileLayers[mapType].url}
            />
            <MapClickHandler onLocationChange={handleLocationChange} />
            <LocateControl onLocate={handleLocationChange} />
            <div className="leaflet-bottom leaflet-left" style={{ bottom: 10, left: 10 }}>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="shadow-md gap-1"
                onClick={() => setMapType(mapType === "street" ? "satellite" : "street")}
                data-testid="button-toggle-map-type"
              >
                <Layers className="w-4 h-4" />
                {mapType === "street" ? "Satélite" : "Mapa"}
              </Button>
            </div>
            {currentMarker && (
              <Marker position={[currentMarker.lat, currentMarker.lng]} icon={markerIcon} />
            )}
          </MapContainer>
        </div>

        <div className="p-4 border-t bg-background flex gap-2">
          {hasLocation && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="flex-shrink-0"
              data-testid="button-clear-location"
            >
              <X className="w-4 h-4 mr-1" />
              Limpar
            </Button>
          )}
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!currentMarker}
            className="flex-1 btn-primary"
            data-testid="button-confirm-location"
          >
            {currentMarker
              ? `Confirmar (${currentMarker.lat.toFixed(4)}, ${currentMarker.lng.toFixed(4)})`
              : "Toque no mapa para selecionar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
