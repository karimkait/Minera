import React, { useState, useMemo } from "react";
import { MineralListing } from "../types";
import {
  Search,
  Filter,
  MapPin,
  ShieldCheck,
  FileCheck,
  Truck,
  Building2,
  MessageSquare,
  Sparkles,
  Layers,
  X,
  RotateCcw,
  SlidersHorizontal,
  Percent,
  CheckCircle2,
  ArrowUpDown,
  Camera,
  Navigation,
  Compass,
  Scale,
  FileText,
} from "lucide-react";

interface MarketplaceListingsProps {
  listings: MineralListing[];
  onOpenLotDetails: (lot: MineralListing) => void;
  onContactSeller: (lot: MineralListing) => void;
  onOpenAddModal: () => void;
  usdToMadRate: number;
  onNavigateToDeposits?: () => void;
  comparedLotIds?: string[];
  onToggleCompareLot?: (lotId: string) => void;
  onNavigateToComparator?: () => void;
  onOpenShippingSlip?: (lot: MineralListing) => void;
}

export type PurityCategory = "all" | "ultra" | "high" | "medium" | "standard" | "precious";

export interface PurityMetrics {
  numericPercent: number | null;
  gramsPerTonne: number | null;
  tier: "ultra" | "high" | "medium" | "standard" | "precious";
  tierLabel: string;
  tierBadgeColor: string;
}

export function getLotPurityInfo(lot: MineralListing): PurityMetrics {
  const combined = `${lot.grade} ${lot.chemicalAssay?.primaryGrade || ""} ${lot.title}`.toLowerCase();

  // Extract percentage e.g. 72.4% or 28.5%
  const percentMatch = combined.match(/(\d+(?:[.,]\d+)?)\s*%/);
  const numericPercent = percentMatch ? parseFloat(percentMatch[1].replace(",", ".")) : null;

  // Extract g/t or ppm e.g. 920 g/t
  const gtMatch = combined.match(/(\d+(?:[.,]\d+)?)\s*(?:g\/t|ppm)/i);
  const gramsPerTonne = gtMatch ? parseFloat(gtMatch[1].replace(",", ".")) : null;

  // Specific high purity identifiers (Acid Grade, high density barite >93%, high BPL)
  const isAcidGrade =
    combined.includes("acid grade") ||
    combined.includes("haute pureté") ||
    combined.includes("purifié") ||
    (combined.includes("bpl") && numericPercent !== null && numericPercent >= 70);

  const isDensityForage =
    combined.includes("densité 4.") ||
    combined.includes("baso4 > 93") ||
    combined.includes("baso4: 93") ||
    combined.includes("93.6%");

  let tier: "ultra" | "high" | "medium" | "standard" | "precious" = "standard";
  let tierLabel = "Teneur Marchande";
  let tierBadgeColor = "text-stone-300 bg-stone-800/70 border-stone-700";

  if (gramsPerTonne !== null && gramsPerTonne > 0) {
    tier = "precious";
    tierLabel = `Flotté Précieux (${gramsPerTonne} g/t)`;
    tierBadgeColor = "text-purple-300 bg-purple-500/15 border-purple-500/30";
  } else if (isAcidGrade || isDensityForage || (numericPercent !== null && numericPercent >= 70)) {
    tier = "ultra";
    tierLabel = numericPercent
      ? `Très Haute Pureté (${numericPercent}%)`
      : "Pureté Supérieure (Acid Grade / 93%+)";
    tierBadgeColor = "text-amber-300 bg-amber-500/20 border-amber-500/40";
  } else if (numericPercent !== null && numericPercent >= 28) {
    tier = "high";
    tierLabel = `Concentré Enrichi (${numericPercent}%)`;
    tierBadgeColor = "text-emerald-300 bg-emerald-500/20 border-emerald-500/40";
  } else if (numericPercent !== null && numericPercent >= 15) {
    tier = "medium";
    tierLabel = `Teneur Marchande (${numericPercent}%)`;
    tierBadgeColor = "text-blue-300 bg-blue-500/20 border-blue-500/40";
  } else {
    tier = "standard";
    tierLabel = numericPercent ? `Tout-venant (${numericPercent}%)` : "Teneur Marchande Standard";
    tierBadgeColor = "text-stone-300 bg-stone-800/80 border-stone-700";
  }

  return { numericPercent, gramsPerTonne, tier, tierLabel, tierBadgeColor };
}

export const MarketplaceListings: React.FC<MarketplaceListingsProps> = ({
  listings,
  onOpenLotDetails,
  onContactSeller,
  onOpenAddModal,
  usdToMadRate,
  onNavigateToDeposits,
  comparedLotIds = [],
  onToggleCompareLot,
  onNavigateToComparator,
  onOpenShippingSlip,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedPurity, setSelectedPurity] = useState<PurityCategory>("all");
  const [minPurityThreshold, setMinPurityThreshold] = useState<number>(0); // 0, 25, 50, 70
  const [onlyCertifiedLab, setOnlyCertifiedLab] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<
    "date" | "purity-desc" | "price-asc" | "price-desc" | "quantity"
  >("date");

  // Search shortcuts suggestions
  const searchSuggestions = [
    { label: "Phosphate 72% BPL", query: "Phosphate 72%" },
    { label: "Cuivre Bleida 28.5%", query: "Cuivre Bleida" },
    { label: "Cobalt Bou Azzer", query: "Cobalt Bou Azzer" },
    { label: "Argent Zgounder", query: "Argent Zgounder" },
    { label: "Barytine Zelmou", query: "Barytine" },
    { label: "Fluorine Acid Grade", query: "Fluorine 97%" },
  ];

  // Distinct regions extracted from listings
  const regionStats = useMemo(() => {
    const map = new Map<string, number>();
    listings.forEach((lot) => {
      const regKey = lot.region.split("/")[0].trim();
      map.set(regKey, (map.get(regKey) || 0) + 1);
    });
    return Array.from(map.entries()).map(([region, count]) => ({ region, count }));
  }, [listings]);

  // Distinct purity metrics for each listing
  const listingsWithPurity = useMemo(() => {
    return listings.map((lot) => ({
      lot,
      purity: getLotPurityInfo(lot),
    }));
  }, [listings]);

  // Filtered & Sorted listings
  const filteredListings = useMemo(() => {
    return listingsWithPurity
      .filter(({ lot, purity }) => {
        // 1. Search term (multi-field matching)
        if (searchTerm.trim() !== "") {
          const q = searchTerm.toLowerCase().trim();
          const matchTitle = lot.title.toLowerCase().includes(q);
          const matchCategory = lot.category.toLowerCase().includes(q);
          const matchGrade = lot.grade.toLowerCase().includes(q);
          const matchLocation = lot.location.toLowerCase().includes(q);
          const matchRegion = lot.region.toLowerCase().includes(q);
          const matchSeller = lot.sellerName.toLowerCase().includes(q);
          const matchLab = (lot.labName || "").toLowerCase().includes(q);
          const matchDesc = lot.description.toLowerCase().includes(q);
          const matchChemical = (
            (lot.chemicalAssay?.primaryGrade || "") +
            " " +
            (lot.chemicalAssay?.secondaryElements || "") +
            " " +
            (lot.chemicalAssay?.impurities || "")
          ).toLowerCase().includes(q);

          if (
            !matchTitle &&
            !matchCategory &&
            !matchGrade &&
            !matchLocation &&
            !matchRegion &&
            !matchSeller &&
            !matchLab &&
            !matchDesc &&
            !matchChemical
          ) {
            return false;
          }
        }

        // 2. Region filter
        if (selectedRegion !== "all") {
          const lotRegionClean = lot.region.toLowerCase();
          const lotLocationClean = lot.location.toLowerCase();
          const target = selectedRegion.toLowerCase();
          if (!lotRegionClean.includes(target) && !lotLocationClean.includes(target)) {
            return false;
          }
        }

        // 3. Purity tier filter
        if (selectedPurity !== "all") {
          if (selectedPurity === "ultra" && purity.tier !== "ultra") return false;
          if (
            selectedPurity === "high" &&
            purity.tier !== "high" &&
            purity.tier !== "ultra" &&
            !(purity.gramsPerTonne !== null && purity.gramsPerTonne >= 500)
          ) {
            return false;
          }
          if (selectedPurity === "medium" && purity.tier !== "medium") return false;
          if (selectedPurity === "standard" && purity.tier !== "standard") return false;
          if (selectedPurity === "precious" && purity.tier !== "precious") return false;
        }

        // 4. Minimum purity percentage threshold (if set)
        if (minPurityThreshold > 0) {
          if (purity.numericPercent === null || purity.numericPercent < minPurityThreshold) {
            return false;
          }
        }

        // 5. Category filter
        if (selectedCategory !== "all" && lot.category !== selectedCategory) {
          return false;
        }

        // 6. Certified Lab report filter
        if (onlyCertifiedLab && !lot.hasCertifiedLabReport) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-desc") return b.lot.priceMAD - a.lot.priceMAD;
        if (sortBy === "price-asc") return a.lot.priceMAD - b.lot.priceMAD;
        if (sortBy === "quantity") return b.lot.quantityNumber - a.lot.quantityNumber;
        if (sortBy === "purity-desc") {
          const pA = a.purity.numericPercent || (a.purity.gramsPerTonne ? a.purity.gramsPerTonne / 10 : 0);
          const pB = b.purity.numericPercent || (b.purity.gramsPerTonne ? b.purity.gramsPerTonne / 10 : 0);
          return pB - pA;
        }
        return new Date(b.lot.createdAt).getTime() - new Date(a.lot.createdAt).getTime();
      });
  }, [
    listingsWithPurity,
    searchTerm,
    selectedCategory,
    selectedRegion,
    selectedPurity,
    minPurityThreshold,
    onlyCertifiedLab,
    sortBy,
  ]);

  // Check if any filter is active
  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedRegion !== "all" ||
    selectedPurity !== "all" ||
    minPurityThreshold > 0 ||
    onlyCertifiedLab;

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedRegion("all");
    setSelectedPurity("all");
    setMinPurityThreshold(0);
    setOnlyCertifiedLab(false);
    setSortBy("date");
  };

  return (
    <div className="space-y-8">
      {/* Hero Welcome & Stats - Bento Grid container */}
      <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-xl relative overflow-hidden backdrop-blur-sm">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Plateforme Nationale Conforme aux Directives ONHYM & CADEX</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-100 leading-tight">
            Marketplace des Minerais & Concentrés du Maroc
          </h1>

          <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
            Consultez les lots certifiés en provenance directe des bassins miniers marocains : phosphates de Khouribga, cobalt de Bou Azzer, argent de Zgounder, cuivre de Bleida et barytine de l'Oriental.
          </p>

          {onNavigateToDeposits && (
            <div className="pt-1">
              <button
                onClick={onNavigateToDeposits}
                className="inline-flex items-center gap-2 bg-stone-950/80 hover:bg-stone-900 border border-amber-500/30 hover:border-amber-500/60 text-amber-400 hover:text-amber-300 px-4 py-2 rounded-xl text-xs font-semibold transition shadow-md group"
              >
                <Compass className="w-4 h-4 text-amber-500 group-hover:rotate-45 transition-transform" />
                <span>Consulter les Fiches des Gisements Marocains (Google Grounding & ONHYM)</span>
              </button>
            </div>
          )}

          {/* Quick Stats Bento Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-800/80">
            <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-3.5">
              <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400">
                {listings.length}
              </span>
              <p className="text-xs text-stone-400 mt-0.5">Lots disponibles</p>
            </div>
            <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-3.5">
              <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                100%
              </span>
              <p className="text-xs text-stone-400 mt-0.5">Vendeurs KYC vérifiés</p>
            </div>
            <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-3.5">
              <span className="text-2xl sm:text-3xl font-black font-mono text-blue-400">
                {regionStats.length} Bassins
              </span>
              <p className="text-xs text-stone-400 mt-0.5">Régions minières</p>
            </div>
            <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-3.5">
              <span className="text-2xl sm:text-3xl font-black font-mono text-stone-200">
                FOB & Ex-Mine
              </span>
              <p className="text-xs text-stone-400 mt-0.5">Incoterms sécurisés</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH BAR & FILTERING SYSTEM - Bento Card */}
      <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-6 shadow-xl space-y-5 backdrop-blur-sm">
        {/* Row 1: Primary Search Input with Clear button */}
        <div className="space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-amber-500" />
              <span>Barre de Recherche Multi-Critères</span>
            </label>
            <span className="text-xs text-stone-400 font-mono">
              <strong className="text-amber-400">{filteredListings.length}</strong> lot{filteredListings.length > 1 ? "s" : ""} trouvé{filteredListings.length > 1 ? "s" : ""} sur {listings.length}
            </span>
          </div>

          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-amber-500 absolute left-4 pointer-events-none" />
            <input
              type="text"
              id="marketplace-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par minerai, pureté (ex: 72%, 28%), ville (Khouribga, Bou Azzer, Bleida), vendeur ou laboratoire..."
              className="w-full pl-12 pr-12 py-3.5 bg-stone-950 border border-stone-700 rounded-2xl text-sm text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 transition shadow-inner font-medium"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                title="Effacer la recherche"
                className="absolute right-4 p-1 rounded-lg text-stone-300 hover:text-stone-100 hover:bg-stone-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Search Chips / Suggestions */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-stone-300 pt-0.5">
            <span className="shrink-0 text-[11px] font-bold text-stone-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Suggestions :
            </span>
            {searchSuggestions.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setSearchTerm(item.query)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-stone-950 hover:bg-stone-800 text-stone-200 hover:text-amber-300 border border-stone-700 transition cursor-pointer text-[11px] font-semibold"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Bento Grid of Filters (Region, Purity, Threshold, Sort) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-stone-800">
          {/* 1. Region Filter Dropdown */}
          <div className="space-y-1.5 bg-stone-950 p-3 rounded-2xl border border-stone-700">
            <label className="text-[11px] font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>Filtrer par Région</span>
            </label>
            <select
              id="filter-region-select"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 cursor-pointer font-medium"
            >
              <option value="all" className="bg-stone-900 text-stone-100">
                Toutes les régions ({listings.length} lots)
              </option>
              {regionStats.map(({ region, count }) => (
                <option key={region} value={region} className="bg-stone-900 text-stone-100">
                  {region} ({count} lot{count > 1 ? "s" : ""})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Purity / Teneur Category Filter */}
          <div className="space-y-1.5 bg-stone-950 p-3 rounded-2xl border border-stone-700">
            <label className="text-[11px] font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-amber-500" />
              <span>Filtrer par Pureté</span>
            </label>
            <select
              id="filter-purity-select"
              value={selectedPurity}
              onChange={(e) => setSelectedPurity(e.target.value as PurityCategory)}
              className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 cursor-pointer font-medium"
            >
              <option value="all" className="bg-stone-900 text-stone-100">
                Toutes les puretés
              </option>
              <option value="ultra" className="bg-stone-900 text-amber-300">
                💎 Très Haute Pureté (≥ 70% ou Acid Grade)
              </option>
              <option value="high" className="bg-stone-900 text-emerald-300">
                ⭐ Concentré Enrichi (≥ 28% ou &gt; 500 g/t)
              </option>
              <option value="medium" className="bg-stone-900 text-blue-300">
                ⚡ Teneur Marchande (15% à 28%)
              </option>
              <option value="precious" className="bg-stone-900 text-purple-300">
                🪙 Métaux Précieux Flottés (g/t)
              </option>
              <option value="standard" className="bg-stone-900 text-stone-200">
                Tout-venant / Standard (&lt; 15%)
              </option>
            </select>
          </div>

          {/* 3. Minimum Purity % Threshold Buttons */}
          <div className="space-y-1.5 bg-stone-950 p-3 rounded-2xl border border-stone-700">
            <label className="text-[11px] font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
              <span>Seuil de Teneur Min.</span>
            </label>
            <div className="grid grid-cols-4 gap-1 pt-0.5">
              {[
                { label: "Tous", val: 0 },
                { label: "≥ 25%", val: 25 },
                { label: "≥ 50%", val: 50 },
                { label: "≥ 70%", val: 70 },
              ].map((th) => (
                <button
                  key={th.val}
                  type="button"
                  onClick={() => setMinPurityThreshold(th.val)}
                  className={`py-1.5 px-1 rounded-lg text-xs font-semibold transition cursor-pointer text-center ${
                    minPurityThreshold === th.val
                      ? "bg-amber-500 text-stone-950 shadow-sm"
                      : "bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-800"
                  }`}
                >
                  {th.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Sort Selector */}
          <div className="space-y-1.5 bg-stone-950/60 p-3 rounded-2xl border border-stone-800/70">
            <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-500" />
              <span>Trier les Résultats</span>
            </label>
            <select
              id="sort-listings-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 cursor-pointer"
            >
              <option value="date" className="bg-stone-900 text-stone-200">
                Plus récents d'abord
              </option>
              <option value="purity-desc" className="bg-stone-900 text-stone-200">
                Pureté / Teneur décroissante
              </option>
              <option value="price-desc" className="bg-stone-900 text-stone-200">
                Prix décroissant (MAD)
              </option>
              <option value="price-asc" className="bg-stone-900 text-stone-200">
                Prix croissant (MAD)
              </option>
              <option value="quantity" className="bg-stone-900 text-stone-200">
                Quantité disponible (Tonnage)
              </option>
            </select>
          </div>
        </div>

        {/* Row 3: Quick Regional Filter Chips (1-click region switch) */}
        <div className="space-y-2 pt-1 border-t border-stone-800/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>Accès Direct aux Régions Minières :</span>
            </span>
            {selectedRegion !== "all" && (
              <button
                type="button"
                onClick={() => setSelectedRegion("all")}
                className="text-[11px] text-amber-400 hover:underline cursor-pointer"
              >
                Voir toutes les régions
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedRegion("all")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition whitespace-nowrap cursor-pointer text-xs flex items-center gap-1.5 ${
                selectedRegion === "all"
                  ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-950/40"
                  : "bg-stone-950/80 text-stone-400 border border-stone-800 hover:text-stone-200 hover:border-stone-700"
              }`}
            >
              <span>Toutes</span>
              <span className="text-[10px] opacity-75 font-mono">({listings.length})</span>
            </button>
            {regionStats.map(({ region, count }) => (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegion(region)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition whitespace-nowrap cursor-pointer text-xs flex items-center gap-1.5 ${
                  selectedRegion === region
                    ? "bg-amber-500 text-stone-950 shadow-md shadow-amber-950/40"
                    : "bg-stone-950/80 text-stone-400 border border-stone-800 hover:text-stone-200 hover:border-stone-700"
                }`}
              >
                <span>{region}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 4: Mineral Category Chips & Lab Certified Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-800/80">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-semibold text-stone-500 mr-1 hidden sm:inline">
              Minerais :
            </span>
            {[
              { id: "all", label: "Tous" },
              { id: "phosphate", label: "Phosphate" },
              { id: "cobalt", label: "Cobalt" },
              { id: "argent", label: "Argent" },
              { id: "cuivre", label: "Cuivre" },
              { id: "barite", label: "Barytine" },
              { id: "zinc", label: "Zinc" },
              { id: "plomb", label: "Plomb" },
              { id: "fluorine", label: "Fluorine" },
              { id: "manganese", label: "Manganèse" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full font-semibold transition whitespace-nowrap cursor-pointer text-xs ${
                  selectedCategory === cat.id
                    ? "bg-stone-100 text-stone-950 shadow-sm"
                    : "bg-stone-950/80 text-stone-400 border border-stone-800 hover:text-stone-200 hover:border-stone-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-stone-300 cursor-pointer select-none bg-stone-950/60 border border-stone-800 px-3 py-1.5 rounded-full hover:border-stone-700 transition">
            <input
              type="checkbox"
              id="filter-lab-certified-checkbox"
              checked={onlyCertifiedLab}
              onChange={(e) => setOnlyCertifiedLab(e.target.checked)}
              className="rounded border-stone-700 text-amber-500 focus:ring-amber-500 w-4 h-4 bg-stone-900 cursor-pointer"
            />
            <span className="flex items-center gap-1.5 text-stone-300">
              <FileCheck className="w-3.5 h-3.5 text-blue-400" />
              Bulletin Labo Certifié
            </span>
          </label>
        </div>

        {/* Row 5: Active Filters Badges & Reset Button */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-stone-800/80 text-xs">
            <span className="text-stone-500 font-semibold flex items-center gap-1">
              <Filter className="w-3 h-3 text-amber-500" />
              Filtres actifs :
            </span>

            {searchTerm && (
              <span className="inline-flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded-full">
                <span>Recherche: &laquo;{searchTerm}&raquo;</span>
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="hover:text-amber-100 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedRegion !== "all" && (
              <span className="inline-flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded-full">
                <span>Région: {selectedRegion}</span>
                <button
                  type="button"
                  onClick={() => setSelectedRegion("all")}
                  className="hover:text-amber-100 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedPurity !== "all" && (
              <span className="inline-flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded-full">
                <span>
                  Pureté:{" "}
                  {selectedPurity === "ultra"
                    ? "Très Haute Pureté (≥ 70%)"
                    : selectedPurity === "high"
                    ? "Concentré Enrichi"
                    : selectedPurity === "medium"
                    ? "Teneur Standard"
                    : selectedPurity === "precious"
                    ? "Métaux Précieux"
                    : "Tout-venant"}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedPurity("all")}
                  className="hover:text-amber-100 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {minPurityThreshold > 0 && (
              <span className="inline-flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded-full">
                <span>Teneur min: ≥ {minPurityThreshold}%</span>
                <button
                  type="button"
                  onClick={() => setMinPurityThreshold(0)}
                  className="hover:text-amber-100 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded-full">
                <span className="capitalize">Minerai: {selectedCategory}</span>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className="hover:text-amber-100 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {onlyCertifiedLab && (
              <span className="inline-flex items-center gap-1 bg-blue-500/15 border border-blue-500/30 text-blue-300 px-2.5 py-0.5 rounded-full">
                <span>Labo certifié uniquement</span>
                <button
                  type="button"
                  onClick={() => setOnlyCertifiedLab(false)}
                  className="hover:text-blue-100 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition cursor-pointer ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Réinitialiser les filtres</span>
            </button>
          </div>
        )}
      </div>

      {/* Listings Grid - Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map(({ lot, purity }) => (
          <div
            key={lot.id}
            className="bg-stone-900 border border-stone-700 rounded-3xl overflow-hidden shadow-md hover:border-amber-500 hover:bg-stone-850 transition-all duration-200 flex flex-col justify-between group"
          >
            {/* Optional Lot Image Preview */}
            {lot.imageUrl && (
              <div className="relative w-full h-44 bg-stone-950 overflow-hidden border-b border-stone-700 flex items-center justify-center">
                <img
                  src={lot.imageUrl}
                  alt={lot.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />
                {lot.coordinates && (
                  <span className="absolute bottom-2.5 left-3 bg-stone-950 px-2.5 py-1 rounded-full border border-emerald-500/50 text-emerald-300 text-[10px] font-black flex items-center gap-1 shadow-sm">
                    <Navigation className="w-3 h-3 text-emerald-400" />
                    <span>GPS Gisement Vérifié</span>
                  </span>
                )}
              </div>
            )}

            {/* Top header on card */}
            <div className="p-6 space-y-3.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    {lot.category}
                  </span>
                  {/* Dynamic Purity Badge */}
                  <span
                    title={purity.tierLabel}
                    className={`text-[10px] font-black border px-2 py-0.5 rounded-full ${purity.tierBadgeColor}`}
                  >
                    {purity.tierLabel}
                  </span>

                  {/* If no image but coordinates are present */}
                  {!lot.imageUrl && lot.coordinates && (
                    <span className="text-[10px] font-extrabold bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-emerald-400" />
                      GPS
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {onToggleCompareLot && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCompareLot(lot.id);
                      }}
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border transition cursor-pointer ${
                        comparedLotIds.includes(lot.id)
                          ? "bg-amber-500 text-stone-950 border-amber-400 font-extrabold"
                          : "bg-stone-950/70 text-stone-400 border-stone-700 hover:text-stone-200"
                      }`}
                      title={comparedLotIds.includes(lot.id) ? "Retirer du comparateur" : "Ajouter au comparateur"}
                    >
                      <Scale className="w-3 h-3" />
                      <span>{comparedLotIds.includes(lot.id) ? "Comparé" : "Comparer"}</span>
                    </button>
                  )}
                  {lot.hasCertifiedLabReport && (
                    <span
                      title={`Certifié par ${lot.labName || "Laboratoire accrédité"}`}
                      className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-blue-500/15 text-blue-200 border border-blue-500/40 px-2 py-0.5 rounded-full"
                    >
                      <FileCheck className="w-3 h-3 text-blue-400" />
                      Labo
                    </span>
                  )}
                  {lot.sellerVerified && (
                    <span
                      title="Vendeur vérifié KYC / Registre du Commerce"
                      className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-500/15 text-emerald-200 border border-emerald-500/40 px-2 py-0.5 rounded-full"
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      KYC
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-bold text-base text-stone-100 leading-snug group-hover:text-amber-300 transition">
                {lot.title}
              </h3>

              {/* Tonnage & Certified Grade Bento Box */}
              <div className="bg-stone-950 rounded-2xl p-3.5 border border-stone-700 flex items-center justify-between text-xs shadow-inner">
                <div>
                  <span className="text-stone-300 block text-[10px] uppercase font-bold tracking-wider">
                    Teneur certifiée (Pureté)
                  </span>
                  <strong className="text-amber-300 font-mono font-black text-sm">
                    {lot.grade}
                  </strong>
                </div>
                <div className="text-right">
                  <span className="text-stone-300 block text-[10px] uppercase font-bold tracking-wider">
                    Disponibilité
                  </span>
                  <strong className="text-stone-100 font-black text-sm">
                    {lot.quantity}
                  </strong>
                </div>
              </div>

              {/* Location & Incoterms */}
              <div className="space-y-1.5 text-xs text-stone-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate text-stone-200 font-medium">
                    {lot.location} <span className="text-stone-400 font-normal">({lot.region.split("/")[0].trim()})</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>
                    Incoterm: <strong className="text-stone-100 font-bold">{lot.incoterm}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate text-stone-300 font-medium">{lot.sellerName}</span>
                </div>
              </div>
            </div>

            {/* Bottom Card: Price & Action CTA */}
            <div className="p-5 bg-stone-950 border-t border-stone-700 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-stone-300 uppercase font-bold tracking-wider block">
                  Prix départ négocié
                </span>
                <div className="text-lg font-black font-mono text-stone-100 leading-tight">
                  {lot.priceMAD.toLocaleString("fr-FR")}{" "}
                  <span className="text-xs font-sans font-bold text-amber-400">
                    MAD/t
                  </span>
                </div>
                <span className="text-[11px] text-stone-300 font-mono font-medium">
                  ≈ ${(lot.priceMAD / (usdToMadRate || 9.94)).toFixed(0)} USD
                </span>
              </div>

              <div className="flex items-center gap-2">
                {onOpenShippingSlip && (
                  <button
                    type="button"
                    onClick={() => onOpenShippingSlip(lot)}
                    title="Générer le Bordereau d'Expédition (Loi 33-13)"
                    className="p-2 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-600 transition cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onOpenLotDetails(lot)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-600 transition cursor-pointer"
                >
                  Détails
                </button>
                <button
                  type="button"
                  onClick={() => onContactSeller(lot)}
                  className="px-3.5 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-stone-950 transition shadow-sm flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-3 h-3 text-stone-950" />
                  <span>Devis</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Compare Action Bar when lots are selected */}
      {comparedLotIds.length > 0 && onNavigateToComparator && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-stone-900/95 border border-amber-500/50 shadow-2xl rounded-2xl px-5 py-3 flex items-center gap-4 text-xs backdrop-blur-md">
          <div className="flex items-center gap-2 text-stone-200 font-medium">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>
              <strong className="text-amber-400 font-bold">{comparedLotIds.length}</strong> lot(s) sélectionné(s)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToComparator}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-1.5 rounded-xl transition cursor-pointer shadow-md shadow-amber-950/40"
            >
              Comparer maintenant
            </button>
          </div>
        </div>
      )}

      {/* Empty state when no listings match filters */}
      {filteredListings.length === 0 && (
        <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-12 text-center text-stone-400 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Layers className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-stone-200 text-lg">
              Aucun lot ne correspond à vos critères de recherche
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
              Essayez d'élargir votre recherche, de sélectionner une autre région minière ou de baisser le seuil de pureté minimale.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition shadow-md cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser tous les filtres</span>
            </button>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 transition cursor-pointer"
            >
              <span>Publier une demande d'achat</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
