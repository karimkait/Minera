import React from "react";
import { MineralListing } from "../types";
import {
  Scale,
  X,
  Plus,
  MapPin,
  FileCheck,
  ShieldCheck,
  Truck,
  Coins,
  MessageSquare,
  FileText,
  Navigation,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface LotComparatorProps {
  allListings: MineralListing[];
  comparedLotIds: string[];
  onRemoveFromCompare: (lotId: string) => void;
  onClearCompare: () => void;
  onAddLotToCompare: (lotId: string) => void;
  onOpenLotDetails: (lot: MineralListing) => void;
  onContactSeller: (lot: MineralListing) => void;
  onOpenShippingSlip: (lot: MineralListing) => void;
  onSimulateLogistics: (lot: MineralListing) => void;
  usdToMadRate: number;
}

export const LotComparator: React.FC<LotComparatorProps> = ({
  allListings,
  comparedLotIds,
  onRemoveFromCompare,
  onClearCompare,
  onAddLotToCompare,
  onOpenLotDetails,
  onContactSeller,
  onOpenShippingSlip,
  onSimulateLogistics,
  usdToMadRate,
}) => {
  const comparedLots = allListings.filter((l) => comparedLotIds.includes(l.id));

  // Extract pure metal cost indicator (e.g. price per 1% of metal or per gram)
  const computeCostPerUnitOfGrade = (lot: MineralListing) => {
    const gradeStr = lot.grade;
    const matchPercent = gradeStr.match(/([\d.,]+)\s*%/);
    const matchGrams = gradeStr.match(/([\d.,]+)\s*g\/t/);

    if (matchPercent) {
      const pct = parseFloat(matchPercent[1].replace(",", "."));
      if (pct > 0) {
        const costPerPctPoint = Math.round(lot.priceMAD / pct);
        return `${costPerPctPoint.toLocaleString("fr-FR")} MAD / %`;
      }
    } else if (matchGrams) {
      const g = parseFloat(matchGrams[1].replace(",", "."));
      if (g > 0) {
        const costPerGram = (lot.priceMAD / g).toFixed(2);
        return `${costPerGram} MAD / g`;
      }
    }
    return "N/A";
  };

  // Find other lots that can be added
  const availableLots = allListings.filter((l) => !comparedLotIds.includes(l.id));

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full min-w-0">
      {/* Top Banner Header */}
      <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full">
                <Scale className="w-3.5 h-3.5" />
                Analyse Comparative & Rendement Minier
              </span>
              <span className="text-xs text-stone-400 hidden sm:inline">
                Jusqu'à 4 lots côte à côte
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-100 tracking-tight">
              Comparateur Côte-à-Côte de Lots Miniers
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Comparez les teneurs certifiées, les impuretés pénalisantes, les prix au point d'élément pur et la proximité logistique pour choisir le meilleur approvisionnement.
            </p>
          </div>

          {comparedLots.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={onClearCompare}
                className="px-3 py-1.5 rounded-xl border border-stone-800 hover:bg-stone-850 text-stone-400 hover:text-stone-200 text-xs font-semibold transition cursor-pointer"
              >
                Vider la sélection
              </button>
            </div>
          )}
        </div>
      </div>

      {/* If no lots or only 1 lot selected */}
      {comparedLots.length < 2 && (
        <div className="bg-stone-900/40 border border-stone-800/80 rounded-3xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-100">
              {comparedLots.length === 0
                ? "Aucun lot sélectionné pour la comparaison"
                : "Sélectionnez au moins un second lot pour comparer"}
            </h3>
            <p className="text-xs text-stone-400 max-w-md mx-auto mt-1">
              Vous pouvez cocher « Comparer » sur n'importe quelle carte de la Marketplace ou choisir ci-dessous parmi les minerais disponibles :
            </p>
          </div>

          {/* Quick Add Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3 max-w-3xl mx-auto">
            {availableLots.slice(0, 5).map((lot) => (
              <button
                key={lot.id}
                onClick={() => onAddLotToCompare(lot.id)}
                className="flex items-center gap-1.5 bg-stone-950 hover:bg-stone-900 border border-stone-800 hover:border-amber-500/50 text-stone-300 hover:text-stone-100 px-3 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold">{lot.title}</span>
                <span className="text-stone-500">({lot.grade})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Grid Table */}
      {comparedLots.length >= 1 && (
        <div className="overflow-x-auto no-scrollbar">
          <div className="min-w-[760px] bg-stone-900/40 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
            {/* Header row with cards */}
            <div
              className="grid gap-4 p-6 border-b border-stone-800 bg-stone-950/60"
              style={{
                gridTemplateColumns: `200px repeat(${comparedLots.length}, minmax(220px, 1fr)) ${
                  comparedLots.length < 4 ? "minmax(180px, 1fr)" : ""
                }`,
              }}
            >
              <div className="flex flex-col justify-end">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Caractéristiques
                </span>
                <span className="text-[11px] text-stone-500">
                  {comparedLots.length} lot(s) en vis-à-vis
                </span>
              </div>

              {comparedLots.map((lot) => (
                <div
                  key={lot.id}
                  className="bg-stone-900 border border-stone-800 rounded-2xl p-4 relative space-y-2 flex flex-col justify-between"
                >
                  <button
                    onClick={() => onRemoveFromCompare(lot.id)}
                    className="absolute top-2.5 right-2.5 p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition"
                    title="Retirer de la comparaison"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-block mb-1">
                      {lot.category}
                    </span>
                    <h3 className="text-sm font-bold text-stone-100 leading-tight">
                      {lot.title}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-stone-800">
                    <div className="text-base font-black font-mono text-amber-400">
                      {lot.priceMAD.toLocaleString("fr-FR")}{" "}
                      <span className="text-[10px] font-normal text-stone-400">MAD / t</span>
                    </div>
                    <span className="text-[11px] text-stone-400 font-mono block">
                      ≈ ${(lot.priceMAD / (usdToMadRate || 9.94)).toFixed(0)} USD / t
                    </span>
                  </div>
                </div>
              ))}

              {/* Add slot if < 4 */}
              {comparedLots.length < 4 && (
                <div className="border border-dashed border-stone-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2 bg-stone-950/30">
                  <div className="w-8 h-8 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center text-stone-400">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-stone-400 font-medium">Ajouter un autre lot</span>
                  {availableLots.length > 0 && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) onAddLotToCompare(e.target.value);
                      }}
                      className="bg-stone-900 border border-stone-700 text-stone-300 rounded-lg px-2 py-1 text-[11px] max-w-[170px]"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Sélectionner...
                      </option>
                      {availableLots.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.title.slice(0, 22)}...
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>

            {/* Comparison Rows */}
            <div className="divide-y divide-stone-800/80 text-xs">
              {/* Row 1: Teneur Certifiée */}
              <div
                className="grid gap-4 p-4 items-center hover:bg-stone-950/30 transition"
                style={{
                  gridTemplateColumns: `200px repeat(${comparedLots.length}, minmax(220px, 1fr)) ${
                    comparedLots.length < 4 ? "minmax(180px, 1fr)" : ""
                  }`,
                }}
              >
                <div className="font-semibold text-stone-300">Teneur Utile Principale</div>
                {comparedLots.map((lot) => (
                  <div key={lot.id} className="font-mono font-bold text-amber-400 text-sm">
                    {lot.grade}
                  </div>
                ))}
                {comparedLots.length < 4 && <div />}
              </div>

              {/* Row 2: Coût par Unité Pure */}
              <div
                className="grid gap-4 p-4 items-center bg-amber-500/5 hover:bg-amber-500/10 transition"
                style={{
                  gridTemplateColumns: `200px repeat(${comparedLots.length}, minmax(220px, 1fr)) ${
                    comparedLots.length < 4 ? "minmax(180px, 1fr)" : ""
                  }`,
                }}
              >
                <div>
                  <div className="font-bold text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Coût / Unité Pure</span>
                  </div>
                  <span className="text-[10px] text-stone-500">Rendement économique direct</span>
                </div>
                {comparedLots.map((lot) => (
                  <div key={lot.id} className="font-mono font-bold text-stone-100">
                    {computeCostPerUnitOfGrade(lot)}
                  </div>
                ))}
                {comparedLots.length < 4 && <div />}
              </div>

              {/* Row 3: Quantité & Valeur Totale */}
              <div
                className="grid gap-4 p-4 items-center hover:bg-stone-950/30 transition"
                style={{
                  gridTemplateColumns: `200px repeat(${comparedLots.length}, minmax(220px, 1fr)) ${
                    comparedLots.length < 4 ? "minmax(180px, 1fr)" : ""
                  }`,
                }}
              >
                <div className="font-semibold text-stone-300">Volume Total du Lot</div>
                {comparedLots.map((lot) => (
                  <div key={lot.id}>
                    <div className="font-bold text-stone-100">{lot.quantity}</div>
                    <span className="text-[11px] text-stone-400 font-mono">
                      Valeur : {(lot.priceMAD * lot.quantityNumber).toLocaleString("fr-FR")} MAD
                    </span>
                  </div>
                ))}
                {comparedLots.length < 4 && <div />}
              </div>

              {/* Row 4: Localisation & Gisement */}
              <div
                className="grid gap-4 p-4 items-center hover:bg-stone-950/30 transition"
                style={{
                  gridTemplateColumns: `200px repeat(${comparedLots.length}, minmax(220px, 1fr)) ${
                    comparedLots.length < 4 ? "minmax(180px, 1fr)" : ""
                  }`,
                }}
              >
                <div className="font-semibold text-stone-300">Site d'Extraction</div>
                {comparedLots.map((lot) => (
                  <div key={lot.id} className="space-y-1">
                    <div className="flex items-center gap-1 text-stone-200 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>
                        {lot.location} ({lot.region})
                      </span>
                    </div>
                    {lot.coordinates && (
                      <span className="text-[10px] text-emerald-400 font-mono block">
                        GPS: {lot.coordinates.latitude.toFixed(2)}°N, {lot.coordinates.longitude.toFixed(2)}°W
                      </span>
                    )}
                  </div>
                ))}
                {comparedLots.length < 4 && <div />}
              </div>

              {/* Row 5: Incoterm */}
              <div
                className="grid gap-4 p-4 items-center hover:bg-stone-950/30 transition"
                style={{
                  gridTemplateColumns: `200px repeat(${comparedLots.length}, minmax(220px, 1fr)) ${
                    comparedLots.length < 4 ? "minmax(180px, 1fr)" : ""
                  }`,
                }}
              >
                <div className="font-semibold text-stone-300">Conditions de Livraison</div>
                {comparedLots.map((lot) => (
                  <div key={lot.id}>
                    <span className="bg-stone-950 border border-stone-800 text-stone-200 px-2.5 py-1 rounded-lg font-bold text-[11px]">
                      {lot.incoterm}
                    </span>
                  </div>
                ))}
                {comparedLots.length < 4 && <div />}
              </div>

              {/* Row 6: Laboratoire & Certification */}
              <div
                className="grid gap-4 p-4 items-center hover:bg-stone-950/30 transition"
                style={{
                  gridTemplateColumns: `200px repeat(${comparedLots.length}, minmax(220px, 1fr)) ${
                    comparedLots.length < 4 ? "minmax(180px, 1fr)" : ""
                  }`,
                }}
              >
                <div className="font-semibold text-stone-300">Contrôle Laboratoire</div>
                {comparedLots.map((lot) => (
                  <div key={lot.id} className="space-y-0.5">
                    <div className="flex items-center gap-1 text-emerald-400 font-medium">
                      <FileCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>{lot.labName || "Non spécifié"}</span>
                    </div>
                    {lot.labCertificateNumber && (
                      <span className="text-[10px] text-stone-500 font-mono block">
                        N° {lot.labCertificateNumber}
                      </span>
                    )}
                  </div>
                ))}
                {comparedLots.length < 4 && <div />}
              </div>

              {/* Row 7: Impuretés & Humidité */}
              <div
                className="grid gap-4 p-4 items-center hover:bg-stone-950/30 transition"
                style={{
                  gridTemplateColumns: `200px repeat(${comparedLots.length}, minmax(220px, 1fr)) ${
                    comparedLots.length < 4 ? "minmax(180px, 1fr)" : ""
                  }`,
                }}
              >
                <div className="font-semibold text-stone-300">Pénalités & Humidité</div>
                {comparedLots.map((lot) => (
                  <div key={lot.id} className="text-[11px] text-stone-400 space-y-0.5">
                    <div>
                      Humidité : <strong className="text-stone-200">{lot.chemicalAssay?.moisture || "3.5%"}</strong>
                    </div>
                    <div className="text-[10px] text-stone-500">
                      {lot.chemicalAssay?.impurities || "Conforme seuils marchands"}
                    </div>
                  </div>
                ))}
                {comparedLots.length < 4 && <div />}
              </div>

              {/* Row 8: Action Buttons */}
              <div
                className="grid gap-4 p-6 items-center bg-stone-950/80"
                style={{
                  gridTemplateColumns: `200px repeat(${comparedLots.length}, minmax(220px, 1fr)) ${
                    comparedLots.length < 4 ? "minmax(180px, 1fr)" : ""
                  }`,
                }}
              >
                <div className="font-bold text-stone-200">Actions Rapides</div>
                {comparedLots.map((lot) => (
                  <div key={lot.id} className="space-y-2">
                    <button
                      onClick={() => onOpenLotDetails(lot)}
                      className="w-full bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 py-1.5 px-3 rounded-xl text-xs font-semibold transition cursor-pointer"
                    >
                      Détails Complets
                    </button>

                    <button
                      onClick={() => onOpenShippingSlip(lot)}
                      className="w-full bg-stone-900 hover:bg-stone-800 text-amber-400 border border-stone-700 hover:border-amber-500/50 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Bordereau Export</span>
                    </button>

                    <button
                      onClick={() => onSimulateLogistics(lot)}
                      className="w-full bg-stone-900 hover:bg-stone-800 text-blue-400 border border-stone-700 hover:border-blue-500/50 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Simuler Fret</span>
                    </button>

                    <button
                      onClick={() => onContactSeller(lot)}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-1.5 px-3 rounded-xl text-xs transition shadow-sm cursor-pointer"
                    >
                      Demander Devis
                    </button>
                  </div>
                ))}
                {comparedLots.length < 4 && <div />}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
