import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  MapPin,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Upload,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Compass,
  X,
  FlipHorizontal,
  Navigation,
} from "lucide-react";
import {
  GpsLocation,
  detectMoroccanMiningBasin,
  formatCoordinates,
  getGoogleMapsUrl,
} from "../utils/geoUtils";

interface CameraGpsCaptureProps {
  onCapture: (data: {
    imageUrl: string;
    coordinates?: GpsLocation;
    detectedBasin?: string;
    detectedRegion?: string;
  }) => void;
  initialImageUrl?: string;
  initialCoordinates?: GpsLocation;
  modeTitle?: string;
}

// Famous Moroccan mining basins for manual test simulation when GPS is off
const MOROCCAN_MINING_SITES_PRESETS = [
  {
    name: "Bou Azzer (Cobalt / Nickel)",
    lat: 30.528,
    lng: -6.912,
    region: "Drâa-Tafilalet (Ouarzazate)",
  },
  {
    name: "Bleida (Cuivre / Or)",
    lat: 30.405,
    lng: -6.535,
    region: "Drâa-Tafilalet (Zagora)",
  },
  {
    name: "Zgounder (Argent Pur)",
    lat: 30.732,
    lng: -7.765,
    region: "Souss-Massa (Taroudant / Siroua)",
  },
  {
    name: "Khouribga (Phosphate BPL 72%)",
    lat: 32.885,
    lng: -6.905,
    region: "Béni Mellal-Khénifra",
  },
  {
    name: "Zelmou / Bouarfa (Barytine)",
    lat: 32.531,
    lng: -1.968,
    region: "Oriental (Figuig)",
  },
  {
    name: "Mibladen (Barytine / Plomb)",
    lat: 32.748,
    lng: -4.652,
    region: "Drâa-Tafilalet (Midelt)",
  },
];

export const CameraGpsCapture: React.FC<CameraGpsCaptureProps> = ({
  onCapture,
  initialImageUrl,
  initialCoordinates,
  modeTitle = "Photo du Lot & Géolocalisation du Gisement",
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(initialImageUrl || null);
  const [coordinates, setCoordinates] = useState<GpsLocation | null>(initialCoordinates || null);
  const [isLoadingGps, setIsLoadingGps] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [stampGpsOnImage, setStampGpsOnImage] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async (overrideFacing?: "environment" | "user") => {
    setCameraError(null);
    stopCamera();

    const targetFacing = overrideFacing || facingMode;

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          "Votre navigateur ne supporte pas l'accès direct à la caméra. Utilisez le bouton 'Prendre une photo' ou 'Importer'."
        );
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: targetFacing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);

      // Trigger background GPS fetch so it's ready when taking the picture
      fetchCurrentGps();
    } catch (err: any) {
      console.warn("Camera start failed:", err);
      let message = "Impossible d'accéder à la caméra.";
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        message =
          "Autorisation refusée : Veuillez autoriser l'accès à la caméra dans les paramètres de votre navigateur, ou cliquez sur 'Appareil Photo Mobile' ci-dessous.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        message = "Aucun capteur caméra détecté sur cet appareil.";
      } else if (err.name === "NotReadableError") {
        message = "La caméra est déjà utilisée par une autre application.";
      }
      setCameraError(message);
      setIsCameraActive(false);
    }
  };

  const toggleFacingMode = () => {
    const nextMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextMode);
    if (isCameraActive) {
      startCamera(nextMode);
    }
  };

  // Fetch real GPS position via Geolocation API
  const fetchCurrentGps = (customCoords?: { lat: number; lng: number; label?: string }): Promise<GpsLocation | null> => {
    return new Promise((resolve) => {
      if (customCoords) {
        const basin = detectMoroccanMiningBasin(customCoords.lat, customCoords.lng);
        const loc: GpsLocation = {
          latitude: customCoords.lat,
          longitude: customCoords.lng,
          accuracy: 5,
          timestamp: new Date().toISOString(),
          locationHint: customCoords.label || basin.basinName,
        };
        setCoordinates(loc);
        setGpsError(null);
        resolve(loc);
        return;
      }

      if (!navigator.geolocation) {
        setGpsError("La géolocalisation n'est pas supportée par votre navigateur.");
        resolve(null);
        return;
      }

      setIsLoadingGps(true);
      setGpsError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const basin = detectMoroccanMiningBasin(lat, lng);

          const loc: GpsLocation = {
            latitude: lat,
            longitude: lng,
            accuracy: position.coords.accuracy ? Math.round(position.coords.accuracy) : undefined,
            altitude: position.coords.altitude,
            timestamp: new Date().toISOString(),
            locationHint: basin.basinName,
          };

          setCoordinates(loc);
          setIsLoadingGps(false);
          resolve(loc);
        },
        (error) => {
          console.warn("Geolocation error:", error);
          let msg = "Impossible d'obtenir les coordonnées GPS.";
          if (error.code === error.PERMISSION_DENIED) {
            msg = "Autorisation GPS refusée par le navigateur. Vous pouvez choisir un bassin minier témoin ci-dessous.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            msg = "Signal GPS indisponible. Activez la localisation de votre appareil.";
          } else if (error.code === error.TIMEOUT) {
            msg = "Délai GPS dépassé. Veuillez réessayer.";
          }
          setGpsError(msg);
          setIsLoadingGps(false);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  // Capture snapshot from active video stream
  const handleSnapPhoto = async () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get current or fresh GPS coordinates
    let loc = coordinates;
    if (!loc) {
      loc = await fetchCurrentGps();
    }

    // Optional: Watermark GPS onto image for mining traceability
    if (stampGpsOnImage && loc) {
      const basinInfo = detectMoroccanMiningBasin(loc.latitude, loc.longitude);
      const textDate = new Date().toLocaleString("fr-FR", {
        timeZone: "Africa/Casablanca",
      });
      const coordsText = `GPS: ${formatCoordinates(loc.latitude, loc.longitude)} (±${loc.accuracy || 10}m)`;
      const basinText = `Gisement: ${basinInfo.basinName} [ONHYM / CADEX Cert]`;

      // Dark translucent banner at bottom
      const bannerHeight = 70;
      ctx.fillStyle = "rgba(10, 10, 10, 0.78)";
      ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, bannerHeight);

      // Gold line separator
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, 3);

      // Text styling
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(basinText, 20, canvas.height - bannerHeight + 26);

      ctx.fillStyle = "#fbbf24";
      ctx.font = "14px monospace";
      ctx.fillText(coordsText, 20, canvas.height - bannerHeight + 48);

      ctx.fillStyle = "#a8a29e";
      ctx.font = "12px sans-serif";
      ctx.fillText(`Date: ${textDate} (Maroc)`, canvas.width - 240, canvas.height - bannerHeight + 48);
    }

    const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
    setCapturedImage(dataUrl);
    stopCamera();

    const basin = loc ? detectMoroccanMiningBasin(loc.latitude, loc.longitude) : undefined;
    onCapture({
      imageUrl: dataUrl,
      coordinates: loc || undefined,
      detectedBasin: basin?.basinName,
      detectedRegion: basin?.region,
    });
  };

  // Handle mobile native camera input or file upload
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setCapturedImage(dataUrl);

      // Fetch or keep GPS
      let loc = coordinates;
      if (!loc) {
        loc = await fetchCurrentGps();
      }

      const basin = loc ? detectMoroccanMiningBasin(loc.latitude, loc.longitude) : undefined;
      onCapture({
        imageUrl: dataUrl,
        coordinates: loc || undefined,
        detectedBasin: basin?.basinName,
        detectedRegion: basin?.region,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleResetPhoto = () => {
    setCapturedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (nativeCameraInputRef.current) nativeCameraInputRef.current.value = "";
  };

  const detectedBasin = coordinates
    ? detectMoroccanMiningBasin(coordinates.latitude, coordinates.longitude)
    : null;

  return (
    <div className="space-y-4 bg-stone-950/70 border border-stone-800 rounded-3xl p-5 text-stone-100">
      {/* Title & Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-stone-100">{modeTitle}</h4>
            <p className="text-[11px] text-stone-400">
              Traçabilité avec coordonnées GPS et horodatage certifié du carreau minier
            </p>
          </div>
        </div>

        {coordinates && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
            <ShieldCheck className="w-3 h-3" />
            GPS Certifié
          </span>
        )}
      </div>

      {/* Main Preview Area */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 min-h-[220px] flex items-center justify-center">
        {/* Hidden Canvas for snapshot processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Hidden inputs for native camera and files */}
        <input
          ref={nativeCameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileInput}
          className="hidden"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        {/* 1. If Camera is Active: Live video stream */}
        {isCameraActive ? (
          <div className="relative w-full h-full aspect-video bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Target crosshair overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-amber-400/60 rounded-2xl border-dashed flex items-center justify-center">
                <div className="w-3 h-3 bg-amber-400/80 rounded-full" />
              </div>
            </div>

            {/* Live GPS badge overlay on camera stream */}
            <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-800 text-[11px] text-stone-200 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              {coordinates ? (
                <span className="font-mono text-amber-400">
                  {formatCoordinates(coordinates.latitude, coordinates.longitude)}
                </span>
              ) : (
                <span>Recherche signal GPS...</span>
              )}
            </div>

            {/* Controls over video */}
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4 px-4">
              <button
                type="button"
                onClick={toggleFacingMode}
                title="Changer de caméra (avant/arrière)"
                className="p-3 rounded-full bg-stone-900/90 text-stone-200 hover:bg-stone-800 transition border border-stone-700 cursor-pointer shadow-lg"
              >
                <FlipHorizontal className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleSnapPhoto}
                className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm transition shadow-xl flex items-center gap-2 cursor-pointer transform active:scale-95"
              >
                <Camera className="w-5 h-5" />
                <span>Capturer & Géolocaliser</span>
              </button>

              <button
                type="button"
                onClick={stopCamera}
                title="Fermer la caméra"
                className="p-3 rounded-full bg-stone-900/90 text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition border border-stone-700 cursor-pointer shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : capturedImage ? (
          /* 2. Photo already captured: Display preview with details */
          <div className="relative w-full aspect-video bg-stone-950 flex items-center justify-center group">
            <img
              src={capturedImage}
              alt="Photo du gisement minier"
              className="max-h-full max-w-full object-contain"
            />
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetPhoto}
                className="bg-stone-900/90 hover:bg-stone-800 text-stone-200 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md transition flex items-center gap-1.5 border border-stone-700 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reprendre</span>
              </button>
            </div>

            {/* GPS Watermark preview box if exists */}
            {coordinates && (
              <div className="absolute bottom-3 left-3 right-3 bg-stone-950/85 backdrop-blur-md p-2.5 rounded-xl border border-stone-800 text-xs flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-bold">
                    <MapPin className="w-3 h-3" />
                    <span>{formatCoordinates(coordinates.latitude, coordinates.longitude)}</span>
                    <span className="text-stone-400 font-normal">
                      (±{coordinates.accuracy || 10}m)
                    </span>
                  </div>
                  {detectedBasin && (
                    <p className="text-[10px] text-stone-300 font-medium">
                      {detectedBasin.basinName}
                    </p>
                  )}
                </div>

                <a
                  href={getGoogleMapsUrl(coordinates.latitude, coordinates.longitude)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] font-semibold transition flex items-center gap-1 border border-stone-700"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        ) : (
          /* 3. Empty state: Options to Open Live Camera, Mobile Camera, or Pick file */
          <div className="p-6 text-center space-y-4 w-full max-w-md">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
              <Camera className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h5 className="font-bold text-stone-100 text-sm">
                Prendre la photo du lot ou du carreau de la mine
              </h5>
              <p className="text-xs text-stone-400">
                La caméra enregistre l'échantillon avec le relevé automatique des coordonnées GPS du gisement.
              </p>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => startCamera("environment")}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition shadow-md shadow-amber-950/40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Ouvrir la Caméra</span>
              </button>

              <button
                type="button"
                onClick={() => nativeCameraInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>Appareil Mobile / Galerie</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 text-xs text-stone-500 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-stone-400 hover:text-amber-400 underline cursor-pointer text-[11px]"
              >
                Ou importer une photo depuis vos dossiers
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Diagnostics / Permissions error notice if any */}
      {cameraError && (
        <div className="p-3.5 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-2xl text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <div className="space-y-1">
            <strong className="block font-semibold">Diagnostic Caméra :</strong>
            <p className="text-[11px] leading-relaxed">{cameraError}</p>
            <p className="text-[10px] text-rose-400">
              💡 <em>Astuce sur mobile :</em> Utilisez le bouton <strong>"Appareil Mobile"</strong> ci-dessus pour déclencher directement l'application appareil photo native de votre téléphone.
            </p>
          </div>
        </div>
      )}

      {/* GPS Information Card */}
      <div className="bg-stone-950/90 border border-stone-800/80 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-xs text-stone-200">
              Coordonnées GPS du Gisement Minier
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchCurrentGps()}
              disabled={isLoadingGps}
              className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingGps ? "animate-spin text-amber-500" : ""}`} />
              <span>{isLoadingGps ? "Acquisition GPS..." : "Actualiser Position"}</span>
            </button>
          </div>
        </div>

        {coordinates ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
            <div className="bg-stone-900/80 p-2.5 rounded-xl border border-stone-800">
              <span className="text-[10px] text-stone-500 block">Latitude / Longitude</span>
              <strong className="text-amber-400 font-mono">
                {formatCoordinates(coordinates.latitude, coordinates.longitude)}
              </strong>
            </div>

            <div className="bg-stone-900/80 p-2.5 rounded-xl border border-stone-800">
              <span className="text-[10px] text-stone-500 block">Précision / Tolérance</span>
              <strong className="text-stone-200 font-mono">
                ±{coordinates.accuracy || 5} mètres
              </strong>
            </div>

            <div className="bg-stone-900/80 p-2.5 rounded-xl border border-stone-800 sm:col-span-1">
              <span className="text-[10px] text-stone-500 block">Bassin Identifié</span>
              <strong className="text-emerald-400 truncate block">
                {detectedBasin?.basinName.split("(")[0].trim() || "Gisement Marocain"}
              </strong>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-stone-900/40 rounded-xl border border-stone-800/80 text-xs text-stone-400 flex items-start gap-2">
            <Navigation className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[11px]">
                Aucune coordonnée enregistrée pour l'instant. Cliquez sur <strong>"Actualiser Position"</strong> ou sélectionnez un gisement marocain témoin ci-dessous.
              </p>
            </div>
          </div>
        )}

        {gpsError && (
          <p className="text-[11px] text-amber-400/90 leading-tight flex items-center gap-1.5 pt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{gpsError}</span>
          </p>
        )}

        {/* Quick simulation presets for Moroccan mining sites */}
        <div className="pt-2 border-t border-stone-800/80 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
            Ou sélectionner un site minier marocain de référence :
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {MOROCCAN_MINING_SITES_PRESETS.map((site) => (
              <button
                key={site.name}
                type="button"
                onClick={() =>
                  fetchCurrentGps({
                    lat: site.lat,
                    lng: site.lng,
                    label: site.name,
                  })
                }
                className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-400 border border-stone-800 text-[10px] font-medium transition cursor-pointer"
              >
                {site.name}
              </button>
            ))}
          </div>
        </div>

        {/* Watermark toggle */}
        <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={stampGpsOnImage}
              onChange={(e) => setStampGpsOnImage(e.target.checked)}
              className="w-4 h-4 rounded border-stone-700 bg-stone-900 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-[11px]">
              Incruster automatiquement le filigrane GPS & Date sur la photo
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
