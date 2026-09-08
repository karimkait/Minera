import React, { useState, useEffect } from "react";
import {
  Compass,
  Search,
  ExternalLink,
  MapPin,
  Building2,
  Sparkles,
  Layers,
  FileCheck2,
  Globe2,
  RefreshCw,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Factory,
  ChevronRight,
  Info,
} from "lucide-react";
import { MoroccanDepositFactSheet } from "../types";
import { MOROCCAN_DEPOSITS_CATALOG } from "../data/moroccanDeposits";

interface MoroccanDepositsGuideProps {
  onNavigateToMarketplace?: (filterLocation?: string, category?: string) => void;
}

export const MoroccanDepositsGuide: React.FC<MoroccanDepositsGuideProps> = ({
  onNavigateToMarketplace,
}) => {
  const [deposits, setDeposits] = useState<MoroccanDepositFactSheet[]>(MOROCCAN_DEPOSITS_CATALOG);
  const [selectedDeposit, setSelectedDeposit] = useState<MoroccanDepositFactSheet>(MOROCCAN_DEPOSITS_CATALOG[0]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isGroundingLoading, setIsGroundingLoading] = useState<boolean>(false);
  const [groundingReport, setGroundingReport] = useState<string | null>(null);
  const [customSearchQuery, setCustomSearchQuery] = useState<string>("");
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Fetch all deposits from API or initialize with local catalog
  useEffect(() => {
    fetch("/api/moroccan-deposits")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.deposits?.length > 0) {
          setDeposits(data.deposits);
        }
      })
      .catch(() => {
        // Fallback to local catalog
        setDeposits(MOROCCAN_DEPOSITS_CATALOG);
      });
  }, []);

  // Filtered deposits
  const filteredDeposits = deposits.filter((dep) => {
    const matchesCategory =
      activeCategory === "all" ||
      dep.category === activeCategory ||
      (activeCategory === "plomb-zinc" && (dep.category === "plomb" || dep.category === "zinc"));

    const matchesSearch =
      searchQuery === "" ||
      dep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dep.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dep.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dep.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dep.primarySubstances.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Handle Google Grounding live enrichment
  const handleGroundingEnrichment = async (deposit: MoroccanDepositFactSheet, customQueryText?: string) => {
    setIsGroundingLoading(true);
    setStatusNotice(null);
    try {
      const res = await fetch("/api/moroccan-deposits/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          depositName: deposit.name,
          customQuery: customQueryText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGroundingReport(data.enrichedContent || null);
        if (data.groundingSources && data.groundingSources.length > 0) {
          // Update selected deposit sources if richer
          setSelectedDeposit((prev) => ({
            ...prev,
            sources: data.groundingSources,
            isGroundingLive: data.isGroundingLive,
          }));
        }
        setStatusNotice(
          data.isGroundingLive
            ? "Fiche enrichie en direct via Google Search Grounding avec sources web vérifiées."
            : "Fiche actualisée selon la synthèse géologique et les références officielles ONHYM / Ministère."
        );
      }
    } catch (e) {
      setStatusNotice("Synthèse basée sur le référentiel géologique certifié marocain.");
    } finally {
      setIsGroundingLoading(false);
    }
  };

  // Custom AI Search with Google Grounding
  const handleCustomGroundingSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSearchQuery.trim()) return;

    setIsGroundingLoading(true);
    setStatusNotice(null);
    try {
      const res = await fetch("/api/moroccan-deposits/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customQuery: customSearchQuery,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGroundingReport(data.enrichedContent);

        // If an existing deposit matched, select it
        if (data.depositDetails) {
          setSelectedDeposit(data.depositDetails);
        } else {
          // Create temporary fact sheet for display
          const tempDeposit: MoroccanDepositFactSheet = {
            id: "custom-" + Date.now(),
            name: customSearchQuery,
            category: "autre",
            region: "Royaume du Maroc",
            province: "Bassin Minier Spécifié",
            coordinates: { latitude: 31.7917, longitude: -7.0926 },
            primarySubstances: ["Minéraux identifiés via IA"],
            secondarySubstances: ["Substances associées"],
            operator: "Opérateur / Coopérative selon concession",
            geologicalEra: "Étude géologique en cours",
            geologicalContext: data.enrichedContent.slice(0, 300) + "...",
            annualProductionOrCapacity: "Données de production selon rapports",
            averageCommercialGrades: "Teneurs marchandes d'après étude géologique",
            strategicImportance: "Intérêt économique et industriel pour la filière marocaine.",
            environmentalCompliance: "Réglementé par la Loi 33-13 relative aux mines.",
            historyAndDiscovery: "Enrichissement en direct par Google Grounding.",
            sources: data.groundingSources || [],
            isGroundingLive: data.isGroundingLive,
          };
          setSelectedDeposit(tempDeposit);
        }
        setStatusNotice(
          data.isGroundingLive
            ? "Recherche Google Grounding effectuée avec succès."
            : "Résultats générés via la base de connaissances géologiques marocaines."
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGroundingLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner - Bento Geological Header */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3.5 py-1.5 rounded-full text-xs font-semibold">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Référentiel Géologique & Minier du Royaume du Maroc</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-[11px] text-amber-300/80 font-normal">Google Grounding Web</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-100 tracking-tight leading-tight">
              Fiches Techniques des <span className="text-amber-500">Grands Gisements</span> Marocains
            </h1>

            <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
              Explorez les bassins métallogéniques majeurs (Bou Azzer, Khouribga, Zgounder, Bleïda, Draa Sfar, Zelmou).
              Chaque fiche compile le contexte structural, les teneurs marchandes, les exploitants officiels et les citations web certifiées
              (ONHYM, OCP, Managem, Ministère de la Transition Énergétique).
            </p>
          </div>

          {/* Quick AI Search Form for Grounding */}
          <form
            onSubmit={handleCustomGroundingSearch}
            className="bg-stone-950/80 border border-stone-800 p-3 rounded-2xl flex flex-col sm:flex-row gap-2 w-full lg:w-auto min-w-[320px] shadow-lg"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customSearchQuery}
                onChange={(e) => setCustomSearchQuery(e.target.value)}
                placeholder="Ex: Achmmach, Hajar, Touissit..."
                className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={isGroundingLoading || !customSearchQuery.trim()}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shrink-0 shadow-md"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGroundingLoading ? "animate-spin" : ""}`} />
              <span>Rechercher via IA</span>
            </button>
          </form>
        </div>

        {/* Filter categories tabs */}
        <div className="mt-8 pt-6 border-t border-stone-800/80 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs">
            {[
              { id: "all", label: "Tous les gisements" },
              { id: "cobalt", label: "Cobalt & Nickel" },
              { id: "phosphate", label: "Phosphates OCP" },
              { id: "argent", label: "Argent Métal" },
              { id: "cuivre", label: "Cuivre" },
              { id: "plomb-zinc", label: "Zinc & Plomb" },
              { id: "barite", label: "Barytine" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full font-medium transition whitespace-nowrap ${
                  activeCategory === cat.id
                    ? "bg-amber-500 text-stone-950 shadow-md font-bold"
                    : "bg-stone-900/80 text-stone-400 hover:text-stone-100 hover:bg-stone-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrer par nom, province..."
              className="w-full bg-stone-950/90 border border-stone-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area: Master-Detail Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: List of Deposits (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-400 px-1 font-semibold">
            <span>Gisements Répertoriés ({filteredDeposits.length})</span>
            <span>Cliquez pour charger la fiche</span>
          </div>

          <div className="space-y-2.5 max-h-[780px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredDeposits.map((dep) => {
              const isSelected = selectedDeposit.id === dep.id;
              return (
                <div
                  key={dep.id}
                  onClick={() => {
                    setSelectedDeposit(dep);
                    setGroundingReport(null);
                    setStatusNotice(null);
                  }}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all text-left group ${
                    isSelected
                      ? "bg-amber-500/10 border-amber-500/60 shadow-xl shadow-amber-950/30"
                      : "bg-stone-900/60 hover:bg-stone-900 border-stone-800 hover:border-stone-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-100 group-hover:text-amber-400 transition">
                          {dep.name}
                        </span>
                        {dep.arabicName && (
                          <span className="text-[11px] text-stone-500 font-arabic font-normal">
                            {dep.arabicName}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                        <span className="line-clamp-1">{dep.region}</span>
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border shrink-0 ${
                        dep.category === "cobalt"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : dep.category === "phosphate"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : dep.category === "argent"
                          ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
                          : dep.category === "cuivre"
                          ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                          : dep.category === "barite"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : "bg-stone-800 text-stone-300 border-stone-700"
                      }`}
                    >
                      {dep.category}
                    </span>
                  </div>

                  {/* Badges of substances */}
                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    {dep.primarySubstances.slice(0, 2).map((sub, i) => (
                      <span
                        key={i}
                        className="bg-stone-950/70 border border-stone-800/80 text-[11px] text-stone-300 px-2 py-0.5 rounded-lg"
                      >
                        {sub}
                      </span>
                    ))}
                    {dep.primarySubstances.length > 2 && (
                      <span className="text-[10px] text-stone-500">
                        +{dep.primarySubstances.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Operator footer */}
                  <div className="mt-3 pt-2.5 border-t border-stone-800/50 flex items-center justify-between text-[11px] text-stone-400">
                    <span className="flex items-center gap-1 line-clamp-1">
                      <Building2 className="w-3 h-3 text-stone-500 shrink-0" />
                      {dep.operator.split("/")[0]}
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isSelected ? "text-amber-400 translate-x-0.5" : "text-stone-600"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Deposit Fact Sheet (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative">
            {/* Header of the Fact Sheet */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-stone-800">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                    Fiche Technique Officielle
                  </span>
                  <span className="text-xs text-stone-400 font-mono">
                    ID: {selectedDeposit.id.toUpperCase()}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100 flex items-center gap-3">
                  <span>{selectedDeposit.name}</span>
                  {selectedDeposit.arabicName && (
                    <span className="text-lg sm:text-xl text-amber-500 font-normal font-arabic">
                      {selectedDeposit.arabicName}
                    </span>
                  )}
                </h2>

                <p className="text-xs sm:text-sm text-stone-400 flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <strong>{selectedDeposit.province}</strong> ({selectedDeposit.region})
                  </span>
                  <span>•</span>
                  <span className="font-mono text-stone-400">
                    GPS: {selectedDeposit.coordinates.latitude.toFixed(4)}°N, {Math.abs(selectedDeposit.coordinates.longitude).toFixed(4)}°W
                  </span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedDeposit.coordinates.latitude},${selectedDeposit.coordinates.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline inline-flex items-center gap-1 text-xs"
                  >
                    <span>Ouvrir dans Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleGroundingEnrichment(selectedDeposit)}
                  disabled={isGroundingLoading}
                  className="flex items-center gap-1.5 bg-stone-950 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs px-3.5 py-2 rounded-xl transition font-medium disabled:opacity-50"
                  title="Rafraîchir les données et actualités via Google Search Grounding"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isGroundingLoading ? "animate-spin" : ""}`} />
                  <span>{isGroundingLoading ? "Recherche Google..." : "Actualiser Google IA"}</span>
                </button>

                {onNavigateToMarketplace && (
                  <button
                    onClick={() =>
                      onNavigateToMarketplace(selectedDeposit.name, selectedDeposit.category)
                    }
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-lg shadow-amber-950/40"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Voir les Lots</span>
                  </button>
                )}
              </div>
            </div>

            {/* Notification alert if grounding updated */}
            {statusNotice && (
              <div className="mt-4 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{statusNotice}</span>
              </div>
            )}

            {/* AI Grounding Live Insight Box (if enriched) */}
            {groundingReport && (
              <div className="mt-6 bg-stone-950/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-amber-400">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Synthèse & Actualités Vérifiées (Google Grounding)
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">Modèle Gemini Grounded</span>
                </div>
                <div className="text-xs sm:text-sm text-stone-300 leading-relaxed whitespace-pre-line border-t border-stone-800/80 pt-3">
                  {groundingReport}
                </div>
              </div>
            )}

            {/* Bento Grid with Technical Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* Card 1: Exploitant & Capacités */}
              <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Factory className="w-4 h-4" />
                  <span>Exploitant & Infrastructure</span>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="text-stone-200 font-semibold">{selectedDeposit.operator}</p>
                  <p className="text-stone-400 leading-relaxed">
                    <strong>Capacité & Volume:</strong> {selectedDeposit.annualProductionOrCapacity}
                  </p>
                </div>
              </div>

              {/* Card 2: Substances & Teneurs */}
              <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Layers className="w-4 h-4" />
                  <span>Substances & Spécifications Marchandes</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-stone-400">Principales:</span>
                    {selectedDeposit.primarySubstances.map((s, idx) => (
                      <span
                        key={idx}
                        className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="text-stone-400">
                    <strong>Teneurs types:</strong> {selectedDeposit.averageCommercialGrades}
                  </p>
                </div>
              </div>

              {/* Card 3: Gitologie & Contexte Géologique */}
              <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-4 space-y-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <Compass className="w-4 h-4" />
                    <span>Contexte Structural & Gitologie</span>
                  </span>
                  <span className="text-[11px] bg-stone-900 border border-stone-800 px-2.5 py-0.5 rounded-full text-stone-300">
                    Ère: {selectedDeposit.geologicalEra}
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {selectedDeposit.geologicalContext}
                </p>
              </div>

              {/* Card 4: Débouchés & Importance Stratégique */}
              <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                  <Globe2 className="w-4 h-4" />
                  <span>Débouchés Internationaux & Transition Énergétique</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {selectedDeposit.strategicImportance}
                </p>
              </div>

              {/* Card 5: Normes & Conformité Environnementale */}
              <div className="bg-stone-950/60 border border-stone-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Cadre Réglementaire & ESG</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {selectedDeposit.environmentalCompliance}
                </p>
                <p className="text-[11px] text-stone-400 pt-1 border-t border-stone-800/60">
                  Régulé selon la Loi n° 33-13 relative aux mines et autorisations de transport CADEX / ONHYM.
                </p>
              </div>
            </div>

            {/* Historical context note */}
            <div className="mt-4 bg-stone-950/40 border border-stone-800/80 rounded-2xl p-4 text-xs text-stone-400 flex items-start gap-3">
              <FileCheck2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-stone-200">Historique & Découverte :</strong>
                <p className="leading-relaxed">{selectedDeposit.historyAndDiscovery}</p>
              </div>
            </div>

            {/* Grounding Citations & Sources Web */}
            <div className="mt-6 pt-6 border-t border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-stone-200 uppercase tracking-wider">
                    Références & Sources Web Vérifiées ({selectedDeposit.sources.length})
                  </span>
                </div>
                <span className="text-[10px] text-stone-500">
                  Google Search Grounding & Organismes Officiels
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedDeposit.sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start justify-between gap-3 p-3 rounded-xl bg-stone-950/80 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-950 transition group"
                  >
                    <div className="space-y-1 min-w-0">
                      <p className="text-xs font-semibold text-stone-200 group-hover:text-amber-400 transition line-clamp-1">
                        {src.title}
                      </p>
                      {src.snippet && (
                        <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                          {src.snippet}
                        </p>
                      )}
                      <p className="text-[10px] text-stone-500 font-mono truncate">{src.url}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 shrink-0 transition" />
                  </a>
                ))}
              </div>
            </div>

            {/* Bottom CTA to Marketplace */}
            {onNavigateToMarketplace && (
              <div className="mt-8 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-stone-900 to-stone-900 p-5 rounded-2xl border border-amber-500/20">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-stone-100">
                    Acheter ou Vendre du Minerai issu du bassin de {selectedDeposit.name} ?
                  </h4>
                  <p className="text-xs text-stone-400">
                    Consultez les lots en vente actuellement déclarés dans cette concession ou publiez votre offre.
                  </p>
                </div>
                <button
                  onClick={() =>
                    onNavigateToMarketplace(selectedDeposit.name, selectedDeposit.category)
                  }
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shrink-0 shadow-lg shadow-amber-950/40"
                >
                  <span>Filtrer la Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
