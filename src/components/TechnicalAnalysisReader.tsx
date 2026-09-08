import React, { useState, useRef } from "react";
import {
  FileSpreadsheet,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building2,
  Calendar,
  ShieldCheck,
  PlusCircle,
  RotateCcw,
  Coins,
} from "lucide-react";
import { TechnicalReportAnalysis } from "../types";
import { LAB_BULLETIN_PRESETS, LabBulletinPreset } from "../data/samples";

interface TechnicalAnalysisReaderProps {
  onAddListingFromReport?: (report: TechnicalReportAnalysis) => void;
}

export const TechnicalAnalysisReader: React.FC<TechnicalAnalysisReaderProps> = ({
  onAddListingFromReport,
}) => {
  const [docPreview, setDocPreview] = useState<string | null>(null);
  const [rawText, setRawText] = useState<string>("");
  const [inputMode, setInputMode] = useState<"file" | "text">("file");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<TechnicalReportAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setDocPreview(reader.result as string);
      setReport(null);
    };
    reader.readAsDataURL(file);
  };

  const handleLoadPreset = (preset: LabBulletinPreset) => {
    setError(null);
    setInputMode("text");
    setRawText(preset.rawText);
    setDocPreview(null);
    setReport(null);
  };

  const handleAnalyze = async () => {
    if (!docPreview && !rawText.trim()) {
      setError("Veuillez importer un document (photo/PDF) ou saisir le texte du bulletin d'analyse.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze-technical-bulletin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentBase64: docPreview || undefined,
          mimeType: docPreview?.includes("pdf") ? "application/pdf" : "image/jpeg",
          textContent: rawText.trim() || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Erreur lors du dépouillement du bulletin d'analyse.");
      }

      setReport(data.report);
    } catch (err: any) {
      console.error(err);
      setError(
        err.message ||
          "Impossible de lire le certificat. Assurez-vous que les données chimiques sont lisibles."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setDocPreview(null);
    setRawText("");
    setReport(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner - Bento Card */}
      <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-xl backdrop-blur-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Laboratoires Miniers Agréés au Maroc</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-100">
            Lecture & Dépouillement d'Analyses Techniques
          </h1>
          <p className="text-stone-400 text-sm mt-1.5 leading-relaxed">
            Scannez ou importez un bulletin d'analyse chimique (Reminex, SGS Maroc, Bureau Veritas, ONHYM, OCP Labs). L'IA extrait automatiquement les teneurs marchandes, calcule les pénalités d'impuretés (As, Cd, Pb, SiO2) et évalue la valeur financière du lot au cours actuel de la bourse.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload or Paste */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-stone-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                <span>Bulletin à analyser</span>
              </h2>

              {/* Mode switch */}
              <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs font-semibold">
                <button
                  onClick={() => setInputMode("file")}
                  className={`px-3 py-1 rounded-lg transition ${
                    inputMode === "file" ? "bg-amber-500 text-stone-950 shadow-sm" : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  Fichier / Photo
                </button>
                <button
                  onClick={() => setInputMode("text")}
                  className={`px-3 py-1 rounded-lg transition ${
                    inputMode === "text" ? "bg-amber-500 text-stone-950 shadow-sm" : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  Texte Brut
                </button>
              </div>
            </div>

            {inputMode === "file" ? (
              docPreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 aspect-video flex items-center justify-center">
                  <img
                    src={docPreview}
                    alt="Document d'analyse"
                    className="max-h-full max-w-full object-contain"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-2 right-2 bg-stone-900/90 hover:bg-stone-800 text-stone-200 p-2 rounded-xl text-xs backdrop-blur-sm transition flex items-center gap-1 border border-stone-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Changer</span>
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-800 hover:border-amber-500/70 rounded-2xl p-8 text-center cursor-pointer transition bg-stone-950/60 hover:bg-amber-500/5 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-stone-200">
                    Importer un bulletin de laboratoire
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Photo de certificat, scan XRF ou rapport PDF
                  </p>
                </div>
              )
            ) : (
              <div className="space-y-2">
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Collez ici les résultats d'analyses ou les teneurs chimiques..."
                  rows={8}
                  className="w-full text-xs font-mono p-3.5 rounded-2xl border border-stone-800 bg-stone-950/80 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
                />
              </div>
            )}

            {/* Analyze CTA */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || (!docPreview && !rawText.trim())}
              className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-bold rounded-2xl text-sm transition shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>Dépouillement & Calcul Métallurgique IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>Extraire & Valider le Bulletin Technique</span>
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-rose-950/40 border border-rose-800/80 text-rose-300 rounded-2xl text-xs space-y-2.5">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span className="leading-relaxed">{error}</span>
                </div>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-900/60 hover:bg-rose-800/80 text-rose-200 rounded-xl text-xs font-semibold transition cursor-pointer border border-rose-700/50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Réessayer le dépouillement</span>
                </button>
              </div>
            )}
          </div>

          {/* Preset Lab Bulletins for Immediate 1-Click Testing - Bento Card */}
          <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-5 space-y-3 backdrop-blur-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
              Certificats types de laboratoires marocains (Test direct)
            </span>
            <div className="space-y-2">
              {LAB_BULLETIN_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleLoadPreset(preset)}
                  className="w-full text-left p-3.5 rounded-2xl border border-stone-800 bg-stone-950/60 hover:border-amber-500/50 hover:bg-stone-900/70 transition group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-200 group-hover:text-amber-400">
                      {preset.title}
                    </span>
                    <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-lg font-mono">
                      {preset.referenceDoc}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">
                    🔬 {preset.labName} • 📅 {preset.date}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Structured Lab Assay Report Results */}
        <div className="lg:col-span-7">
          {report ? (
            <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-sm">
              {/* Header result */}
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-stone-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {report.commercialVerdict.gradeQuality}
                    </span>
                    <span className="text-xs text-stone-400">
                      Conformité: <strong className="text-emerald-400">{report.overallComplianceRating}%</strong>
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-stone-100 mt-2">
                    {report.primaryMineralType}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-stone-400 mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-amber-500" />
                      {report.labInfo.laboratoryName}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-stone-300">Réf: {report.labInfo.certificateNumber}</span>
                    <span>•</span>
                    <span>Méthode: {report.labInfo.analyticalMethod}</span>
                  </div>
                </div>

                {onAddListingFromReport && (
                  <button
                    onClick={() => onAddListingFromReport(report)}
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2 rounded-2xl text-xs transition shadow-md shadow-amber-950/40 whitespace-nowrap"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Créer l'Annonce</span>
                  </button>
                )}
              </div>

              {/* Main Payable Elements Table */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  <span>Teneurs Valorisables (Éléments Payables)</span>
                </h3>
                <div className="border border-stone-800 rounded-2xl overflow-hidden bg-stone-950/70">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-900/80 text-stone-300 font-semibold border-b border-stone-800">
                      <tr>
                        <th className="p-3">Élément</th>
                        <th className="p-3">Teneur Certifiée</th>
                        <th className="p-3">Positionnement Marché</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/80">
                      {report.mainPayableElements.map((el, i) => (
                        <tr key={i} className="hover:bg-stone-900/50">
                          <td className="p-3 font-bold font-mono text-stone-100 text-sm">
                            {el.element}
                          </td>
                          <td className="p-3 font-bold text-amber-400 text-sm">
                            {el.grade}
                          </td>
                          <td className="p-3 text-stone-400">
                            {el.benchmarkComparison}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Penalty and Impurities */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Impuretés & Risque de Pénalité Fonderie</span>
                </h3>
                <div className="border border-stone-800 rounded-2xl overflow-hidden bg-stone-950/70">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-900/80 text-stone-300 font-semibold border-b border-stone-800">
                      <tr>
                        <th className="p-3">Impureté</th>
                        <th className="p-3">Teneur Mesurée</th>
                        <th className="p-3">Seuil Toléré</th>
                        <th className="p-3">Impact Financier</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/80">
                      {report.penaltyAndImpurities.map((imp, i) => (
                        <tr key={i} className="hover:bg-stone-900/50">
                          <td className="p-3 font-semibold text-stone-200">
                            {imp.element}
                          </td>
                          <td className="p-3 font-mono text-stone-100">
                            {imp.content}
                          </td>
                          <td className="p-3 text-stone-400 font-mono">
                            {imp.thresholdAllowed}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                                imp.penaltyRisk.toLowerCase().includes("aucun")
                                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                                  : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                              }`}
                            >
                              {imp.penaltyRisk}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Physical Parameters - Bento Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-stone-950/70 p-3.5 rounded-2xl border border-stone-800/80">
                  <span className="text-stone-500 block text-[11px]">Humidité résiduelle</span>
                  <strong className="text-stone-200 text-sm">
                    {report.physicalParameters.moisture || "Non spécifiée"}
                  </strong>
                </div>
                <div className="bg-stone-950/70 p-3.5 rounded-2xl border border-stone-800/80">
                  <span className="text-stone-500 block text-[11px]">Granulométrie</span>
                  <strong className="text-stone-200 text-sm">
                    {report.physicalParameters.granulometry || "Tout-venant"}
                  </strong>
                </div>
                <div className="bg-stone-950/70 p-3.5 rounded-2xl border border-stone-800/80">
                  <span className="text-stone-500 block text-[11px]">Densité apparente</span>
                  <strong className="text-stone-200 text-sm">
                    {report.physicalParameters.specificGravity || "Standard"}
                  </strong>
                </div>
              </div>

              {/* Commercial Valuation Box - Bento Accent Tile */}
              <div className="bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 p-6 rounded-3xl shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-stone-900">
                    Valorisation Boursière Indicative
                  </span>
                  <span className="text-xs bg-stone-950/20 border border-stone-950/30 text-stone-950 font-bold px-2.5 py-0.5 rounded-full">
                    Conforme Export: {report.commercialVerdict.isExportCompliant ? "OUI" : "NON"}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono text-stone-950">
                    {report.commercialVerdict.estimatedValueMADPerTonne.toLocaleString("fr-FR")}
                  </span>
                  <span className="text-sm font-bold text-stone-900">MAD / Tonne</span>
                </div>

                <p className="text-xs text-stone-900 leading-relaxed font-medium">
                  {report.commercialVerdict.valuationSummary}
                </p>

                <div className="pt-2 border-t border-stone-900/20 text-xs space-y-1">
                  <span className="font-bold text-stone-900 text-[11px] uppercase tracking-wider block">
                    Conseils de valorisation :
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-stone-900 text-[11px]">
                    {report.commercialVerdict.buyerRecommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>

                {onAddListingFromReport && (
                  <button
                    type="button"
                    onClick={() => onAddListingFromReport(report)}
                    className="w-full mt-4 py-3 px-4 rounded-2xl bg-stone-950 hover:bg-stone-900 text-amber-400 border border-amber-400/40 hover:border-amber-400 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Publier ce lot certifié sur la Marketplace MinéraMaroc</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-12 text-center text-stone-400 space-y-3 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-2xl bg-stone-950 border border-stone-800 text-stone-400 flex items-center justify-center mx-auto shadow-sm">
                <FileSpreadsheet className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="font-bold text-stone-100 text-base">
                Aucun bulletin chargé
              </h3>
              <p className="text-xs text-stone-400 max-w-md mx-auto">
                Téléchargez un bulletin de laboratoire (image ou PDF) ou testez instantanément l'un des certificats types Reminex, SGS ou ALS Minerals ci-contre.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
