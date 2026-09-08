import React, { useState, useRef } from "react";
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MapPin,
  HelpCircle,
  PlusCircle,
  RotateCcw,
  Zap,
  Info,
  Navigation,
} from "lucide-react";
import { MineralIdentificationResult } from "../types";
import { ROCK_SAMPLE_PRESETS, MineralSamplePreset } from "../data/samples";
import { CameraGpsCapture } from "./CameraGpsCapture";
import { GpsLocation, formatCoordinates } from "../utils/geoUtils";

interface MineralIdentifierProps {
  onAddListingFromRecognition?: (result: MineralIdentificationResult) => void;
}

export const MineralIdentifier: React.FC<MineralIdentifierProps> = ({
  onAddListingFromRecognition,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [gpsCoordinates, setGpsCoordinates] = useState<GpsLocation | undefined>(undefined);
  const [detectedBasin, setDetectedBasin] = useState<string | undefined>(undefined);
  const [userNotes, setUserNotes] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MineralIdentificationResult | null>(null);

  // Handle capture from live camera or GPS
  const handleCaptureFromCameraGps = (data: {
    imageUrl: string;
    coordinates?: GpsLocation;
    detectedBasin?: string;
    detectedRegion?: string;
  }) => {
    setImagePreview(data.imageUrl);
    setError(null);
    setResult(null);

    if (data.coordinates) {
      setGpsCoordinates(data.coordinates);
      setDetectedBasin(data.detectedBasin);

      // Add context to notes if not already present
      const gpsString = `[Coordonnées GPS terrain : ${formatCoordinates(data.coordinates.latitude, data.coordinates.longitude)} | Bassin présumé : ${data.detectedBasin || "Maroc"}]`;
      if (!userNotes.includes("Coordonnées GPS")) {
        setUserNotes((prev) => (prev ? `${prev}\n${gpsString}` : gpsString));
      }
    }
  };

  // Load a Moroccan mineral preset
  const handleLoadPreset = (preset: MineralSamplePreset) => {
    setError(null);
    setImagePreview(preset.previewSvg);
    setUserNotes(preset.notes);
    setGpsCoordinates(undefined);
    setDetectedBasin(undefined);
    setResult(null);
  };

  // Run AI Identification via backend API
  const handleAnalyze = async () => {
    if (!imagePreview) {
      setError("Veuillez sélectionner ou prendre une photo d'un échantillon de minerai.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Enrich userNotes with GPS info if available
      let enrichedNotes = userNotes.trim();
      if (gpsCoordinates && !enrichedNotes.includes(gpsCoordinates.latitude.toString())) {
        enrichedNotes += ` (Coordonnées satellite précises : ${gpsCoordinates.latitude}, ${gpsCoordinates.longitude})`;
      }

      const response = await fetch("/api/identify-mineral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: imagePreview,
          mimeType: imagePreview.startsWith("data:image/svg+xml")
            ? "image/svg+xml"
            : "image/jpeg",
          userNotes: enrichedNotes || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Erreur d'analyse de l'échantillon.");
      }

      setResult(data.analysis);
    } catch (err: any) {
      console.error(err);
      setError(
        err.message ||
          "Impossible de réaliser l'identification IA. Veuillez réessayer avec une image plus nette."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setGpsCoordinates(undefined);
    setDetectedBasin(undefined);
    setResult(null);
    setError(null);
    setUserNotes("");
  };

  return (
    <div className="space-y-8">
      {/* Intro Header - Bento Card */}
      <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-xl backdrop-blur-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Intelligence Artificielle Géologique Marocaine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-100">
            Reconnaissance Visuelle de Minerais & Pierres
          </h1>
          <p className="text-stone-400 text-sm mt-1.5 leading-relaxed">
            Photographiez votre échantillon de roche ou minerai brut. Notre modèle IA identifie l'espèce minérale, sa formule chimique, ses gisements d'occurrence au Maroc (Bou Azzer, Bleida, Khouribga, Zgounder, Touissit, etc.), sa valeur marchande et les tests de validation sur le terrain.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image input & Observation notes */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-sm">
            <h2 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-500" />
              <span>Échantillon à analyser</span>
            </h2>

            {/* Camera and GPS Capture or Preview */}
            <CameraGpsCapture
              onCapture={handleCaptureFromCameraGps}
              initialImageUrl={imagePreview || undefined}
              initialCoordinates={gpsCoordinates}
              modeTitle="Photo de l'Échantillon & GPS du Gisement"
            />

            {/* Optional notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300 flex items-center justify-between">
                <span>Indices & observations de terrain (Facultatif)</span>
                <span className="text-[11px] text-stone-500 font-normal">
                  Région, dureté, trace...
                </span>
              </label>
              <textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="Ex: Échantillon trouvé près de Bou Azzer, couleur rose carmin, raye le calcaire mais pas le quartz..."
                rows={2}
                className="w-full text-xs p-3.5 rounded-2xl border border-stone-800 bg-stone-950/80 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
              />
            </div>

            {/* Submit Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !imagePreview}
              className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-bold rounded-2xl text-sm transition shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>Analyse géologique IA en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>Identifier le Minerai & Contexte Marocain</span>
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-rose-950/40 border border-rose-800/80 text-rose-300 rounded-2xl text-xs space-y-2.5">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span className="leading-relaxed">{error}</span>
                </div>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-900/60 hover:bg-rose-800/80 text-rose-200 rounded-xl text-xs font-semibold transition cursor-pointer border border-rose-700/50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Réessayer maintenant</span>
                </button>
              </div>
            )}
          </div>

          {/* Preset Samples of Moroccan Minerals for Quick Testing - Bento Tile */}
          <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-5 space-y-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Échantillons types du Maroc (Test rapide)
              </span>
              <span className="text-[11px] text-amber-400 font-semibold">1-clic</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ROCK_SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleLoadPreset(preset)}
                  className="text-left p-3 rounded-2xl border border-stone-800 bg-stone-950/60 hover:border-amber-500/50 hover:bg-stone-900/70 transition group flex items-start gap-2.5"
                >
                  <div
                    className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm"
                    style={{ backgroundColor: preset.colorHex }}
                  >
                    ⛏️
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-stone-200 group-hover:text-amber-400 truncate">
                      {preset.name}
                    </div>
                    <div className="text-[10px] text-stone-500 truncate">
                      📍 {preset.deposit}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis Result Display */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-sm">
              {/* Header result */}
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-stone-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {result.mineralClass}
                    </span>
                    <span className="text-xs text-stone-400">
                      Indice de confiance: <strong className="text-emerald-400">{result.confidenceScore}%</strong>
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-stone-100 mt-2">
                    {result.commonName}
                  </h2>
                  <p className="text-xs font-mono text-stone-400 mt-0.5">
                    {result.scientificName} • <strong className="text-amber-400">{result.chemicalFormula}</strong>
                  </p>
                </div>

                {onAddListingFromRecognition && (
                  <button
                    onClick={() => onAddListingFromRecognition(result)}
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-2xl text-xs transition shadow-md shadow-amber-950/40"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Créer un Lot</span>
                  </button>
                )}
              </div>

              {/* Visual description */}
              <div className="text-xs text-stone-300 leading-relaxed bg-stone-950/70 p-4 rounded-2xl border border-stone-800/80">
                <strong className="text-amber-400">Diagnostic Visuel :</strong> {result.visualDescription}
              </div>

              {/* Physical Properties Grid - Bento Tiles */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2.5">
                  Propriétés Physiques Diagnostiques
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-stone-950/70 p-3 rounded-2xl border border-stone-800/80">
                    <span className="text-stone-500 block text-[11px]">Éclat</span>
                    <strong className="text-stone-200">{result.physicalProperties.luster}</strong>
                  </div>
                  <div className="bg-stone-950/70 p-3 rounded-2xl border border-stone-800/80">
                    <span className="text-stone-500 block text-[11px]">Couleur du Trait</span>
                    <strong className="text-stone-200">{result.physicalProperties.streak}</strong>
                  </div>
                  <div className="bg-stone-950/70 p-3 rounded-2xl border border-stone-800/80">
                    <span className="text-stone-500 block text-[11px]">Dureté (Mohs)</span>
                    <strong className="text-stone-200">{result.physicalProperties.hardnessMohs}</strong>
                  </div>
                  <div className="bg-stone-950/70 p-3 rounded-2xl border border-stone-800/80">
                    <span className="text-stone-500 block text-[11px]">Densité estimée</span>
                    <strong className="text-stone-200">{result.physicalProperties.density}</strong>
                  </div>
                  <div className="bg-stone-950/70 p-3 rounded-2xl border border-stone-800/80 col-span-2">
                    <span className="text-stone-500 block text-[11px]">Clivage & Cassure</span>
                    <strong className="text-stone-200">{result.physicalProperties.cleavage}</strong>
                  </div>
                </div>
              </div>

              {/* Moroccan Mining Occurrences - Bento Tiles */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  <span>Gisements & Bassins Miniers Associés au Maroc</span>
                </h3>
                <div className="space-y-2">
                  {result.moroccanDeposits.map((dep, idx) => (
                    <div
                      key={idx}
                      className="bg-stone-950/70 border border-stone-800/80 p-3.5 rounded-2xl text-xs flex items-start gap-3"
                    >
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-stone-100">{dep.site}</span>
                        <span className="text-stone-400 ml-1.5 font-medium">({dep.region})</span>
                        <p className="text-stone-400 mt-0.5 text-[11px]">{dep.context}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Valuation & Market demand - Bento Card */}
              <div className="bg-stone-950/70 border border-stone-800/80 p-4 rounded-2xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-100 text-sm">
                    Évaluation Commerciale Marché Marocain
                  </span>
                  <span className="font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    {result.marketValuation.commercialValueCategory}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-stone-500 block text-[11px]">Prix indicatif au Maroc :</span>
                    <strong className="text-amber-400 text-sm">
                      {result.marketValuation.estimatedPriceRangeMAD}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[11px]">Teneur marchande type :</span>
                    <strong className="text-stone-200">
                      {result.marketValuation.estimatedGrade}
                    </strong>
                  </div>
                </div>
                <div className="text-stone-400 text-[11px] pt-1">
                  <strong className="text-stone-300">Demande :</strong> {result.marketValuation.marketDemand}
                </div>
              </div>

              {/* Field Tests & Regulations - Bento Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-stone-950/70 p-4 rounded-2xl border border-stone-800/80 space-y-1.5">
                  <span className="font-bold text-stone-200 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Tests de confirmation terrain
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-stone-400 text-[11px]">
                    {result.fieldConfirmationTests.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-stone-950/70 p-4 rounded-2xl border border-stone-800/80 space-y-1.5">
                  <span className="font-bold text-stone-200 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Info className="w-3.5 h-3.5 text-blue-400" />
                    Cadre légal & ONHYM
                  </span>
                  <p className="text-stone-400 text-[11px] leading-relaxed">
                    {result.regulatoryAdvice}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-12 text-center text-stone-400 space-y-3 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl bg-stone-950 border border-stone-800 text-stone-400 flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="font-bold text-stone-100 text-base">
                En attente d'un échantillon
              </h3>
              <p className="text-xs text-stone-400 max-w-md mx-auto">
                Prenez une photo de votre roche minérale ou sélectionnez l'un des échantillons tests du Maroc ci-contre pour obtenir un diagnostic minéralogique complet et instantané.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
