import React, { useState } from "react";
import {
  BourseData,
  BourseMineralQuote,
} from "../types";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Calculator,
  Coins,
  ShieldCheck,
  Building2,
  ArrowUpRight,
  Sparkles,
  Layers,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface BourseDashboardProps {
  bourseData: BourseData | null;
  isLoading: boolean;
  onRefresh: () => void;
  onSelectForMarketplace?: (mineralName: string, priceMAD: number) => void;
}

export const BourseDashboard: React.FC<BourseDashboardProps> = ({
  bourseData,
  isLoading,
  onRefresh,
  onSelectForMarketplace,
}) => {
  const [selectedMineralId, setSelectedMineralId] = useState<string>("cuivre");
  const [displayCurrency, setDisplayCurrency] = useState<"MAD" | "USD">("MAD");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Lot valuation calculator states
  const [calcTonnage, setCalcTonnage] = useState<number>(1000);
  const [calcPayability, setCalcPayability] = useState<number>(90); // 90% typical refinery payability
  const [calcCustomGrade, setCalcCustomGrade] = useState<number>(100); // 100% of benchmark

  const minerals = bourseData?.minerals || [];
  const selectedMineral =
    minerals.find((m) => m.id === selectedMineralId) || minerals[0];

  const filteredMinerals =
    categoryFilter === "all"
      ? minerals
      : minerals.filter((m) => {
          if (categoryFilter === "precieux") return ["argent", "or"].includes(m.category);
          if (categoryFilter === "strategique") return ["cobalt", "cuivre", "zinc", "plomb"].includes(m.category);
          if (categoryFilter === "phosphate") return ["phosphate"].includes(m.category);
          if (categoryFilter === "industriel") return ["barite", "fer", "manganese", "fluorine"].includes(m.category);
          return true;
        });

  // Prepare chart data for selected mineral
  const days = ["J-6", "J-5", "J-4", "J-3", "J-2", "Hier", "Aujourd'hui"];
  const chartData = selectedMineral
    ? selectedMineral.history7d.map((valUSD, index) => {
        const valMAD = selectedMineral.historyMAD[index] || valUSD * (bourseData?.usdToMadRate || 9.94);
        return {
          day: days[index],
          priceUSD: valUSD,
          priceMAD: Math.round(valMAD),
        };
      })
    : [];

  // Calculate lot value
  const basePricePerTonneMAD = selectedMineral ? selectedMineral.priceMAD : 0;
  const basePricePerTonneUSD = selectedMineral ? selectedMineral.priceUSD : 0;

  const adjustedPriceMAD =
    basePricePerTonneMAD * (calcCustomGrade / 100) * (calcPayability / 100);
  const totalLotValueMAD = Math.round(adjustedPriceMAD * calcTonnage);
  const totalLotValueUSD = Math.round(
    (basePricePerTonneUSD * (calcCustomGrade / 100) * (calcPayability / 100)) *
      calcTonnage
  );

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Top Banner: Exchange info & live status - Bento Card */}
      <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-5 sm:p-7 shadow-xl text-stone-100 backdrop-blur-sm w-full min-w-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Marchés Mondiaux en Direct (LME / LBMA / OCP)
              </span>
              <span className="text-[11px] text-stone-400 hidden sm:inline">
                Mise à jour : {bourseData ? new Date(bourseData.timestamp).toLocaleTimeString("fr-FR") : "En direct"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-stone-100">
              Cotations & Bourse des Minerais du Maroc
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Indices de référence officiels convertis en Dirhams (MAD) au cours officiel Bank Al-Maghrib pour les concentrés et gisements marocains.
            </p>
          </div>

          {/* Currency Toggle & Refresh */}
          <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
            <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800">
              <button
                onClick={() => setDisplayCurrency("MAD")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  displayCurrency === "MAD"
                    ? "bg-amber-500 text-stone-950 shadow-sm"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                MAD
              </button>
              <button
                onClick={() => setDisplayCurrency("USD")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  displayCurrency === "USD"
                    ? "bg-amber-500 text-stone-950 shadow-sm"
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                USD ($)
              </button>
            </div>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-850 text-stone-200 px-3 py-1.5 rounded-xl text-xs font-semibold border border-stone-700/80 transition cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-amber-400" : ""}`} />
              <span className="hidden sm:inline">Actualiser</span>
            </button>
          </div>
        </div>

        {/* Global Market Barometers - Bento Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5 pt-5 border-t border-stone-800/80 w-full min-w-0">
          <div className="bg-stone-950/70 p-3.5 rounded-2xl border border-stone-800/80 flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <span className="text-[11px] text-stone-400">Taux de Change BAM</span>
              <div className="text-base sm:text-lg font-bold font-mono text-amber-400 truncate">
                1 USD = {bourseData?.usdToMadRate ? bourseData.usdToMadRate.toFixed(4) : "9.9400"} MAD
              </div>
            </div>
            <Coins className="w-5 h-5 text-amber-500/50 shrink-0 ml-2" />
          </div>

          <div className="bg-stone-950/70 p-3.5 rounded-2xl border border-stone-800/80 flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <span className="text-[11px] text-stone-400">Indice Phosphate OCP</span>
              <div className="text-base sm:text-lg font-bold font-mono text-emerald-400 flex items-center gap-1.5 truncate">
                <span>148.50 $/t</span>
                <span className="text-xs font-normal text-emerald-400">+1.35%</span>
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500/50 shrink-0 ml-2" />
          </div>

          <div className="bg-stone-950/70 p-3.5 rounded-2xl border border-stone-800/80 flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <span className="text-[11px] text-stone-400">Indice Métaux LME</span>
              <div className="text-base sm:text-lg font-bold font-mono text-blue-400 flex items-center gap-1.5 truncate">
                <span>4 180.50 pts</span>
                <span className="text-xs font-normal text-blue-300">+1.24%</span>
              </div>
            </div>
            <Layers className="w-5 h-5 text-blue-500/50 shrink-0 ml-2" />
          </div>
        </div>
      </div>

      {/* Main Grid: Mineral selector and Detail chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0 items-start">
        {/* Left Column: Mineral Price Cards List */}
        <div className="lg:col-span-7 space-y-3.5 w-full min-w-0">
          {/* Category Filter Chips - Clean scrolling container */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs w-full min-w-0">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-3 py-1.5 rounded-full font-semibold transition whitespace-nowrap cursor-pointer shrink-0 ${
                categoryFilter === "all"
                  ? "bg-amber-500 text-stone-950 shadow-sm font-bold"
                  : "bg-stone-900/70 text-stone-400 border border-stone-800 hover:text-stone-200"
              }`}
            >
              Tous ({minerals.length})
            </button>
            <button
              onClick={() => setCategoryFilter("phosphate")}
              className={`px-3 py-1.5 rounded-full font-semibold transition whitespace-nowrap cursor-pointer shrink-0 ${
                categoryFilter === "phosphate"
                  ? "bg-amber-500 text-stone-950 shadow-sm font-bold"
                  : "bg-stone-900/70 text-stone-400 border border-stone-800 hover:text-stone-200"
              }`}
            >
              Phosphates
            </button>
            <button
              onClick={() => setCategoryFilter("strategique")}
              className={`px-3 py-1.5 rounded-full font-semibold transition whitespace-nowrap cursor-pointer shrink-0 ${
                categoryFilter === "strategique"
                  ? "bg-amber-500 text-stone-950 shadow-sm font-bold"
                  : "bg-stone-900/70 text-stone-400 border border-stone-800 hover:text-stone-200"
              }`}
            >
              Stratégiques (Co, Cu, Zn)
            </button>
            <button
              onClick={() => setCategoryFilter("precieux")}
              className={`px-3 py-1.5 rounded-full font-semibold transition whitespace-nowrap cursor-pointer shrink-0 ${
                categoryFilter === "precieux"
                  ? "bg-amber-500 text-stone-950 shadow-sm font-bold"
                  : "bg-stone-900/70 text-stone-400 border border-stone-800 hover:text-stone-200"
              }`}
            >
              Précieux (Ag, Or)
            </button>
            <button
              onClick={() => setCategoryFilter("industriel")}
              className={`px-3 py-1.5 rounded-full font-semibold transition whitespace-nowrap cursor-pointer shrink-0 ${
                categoryFilter === "industriel"
                  ? "bg-amber-500 text-stone-950 shadow-sm font-bold"
                  : "bg-stone-900/70 text-stone-400 border border-stone-800 hover:text-stone-200"
              }`}
            >
              Industriels (Barytine, Mn, Fe)
            </button>
          </div>

          {/* Cards List - Bento Cards with perfect wrapping */}
          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1 w-full min-w-0">
            {filteredMinerals.map((m) => {
              const isSelected = m.id === selectedMineral?.id;
              const isPositive = m.changePercent >= 0;

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMineralId(m.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition cursor-pointer w-full min-w-0 ${
                    isSelected
                      ? "bg-stone-900/90 text-stone-100 border-amber-500 shadow-md ring-1 ring-amber-500/50"
                      : "bg-stone-900/40 text-stone-300 border-stone-800 hover:border-stone-700 hover:bg-stone-900/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 min-w-0">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg shrink-0 ${
                            isSelected
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-stone-950 border border-stone-800 text-stone-400"
                          }`}
                        >
                          {m.symbol}
                        </span>
                        <h3 className="font-bold text-sm sm:text-base leading-tight text-stone-100 truncate">
                          {m.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-stone-400 truncate">
                        <span className="flex items-center gap-1 text-stone-400 truncate">
                          <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="truncate">{m.moroccanBasins.slice(0, 2).join(", ")}</span>
                        </span>
                        <span>•</span>
                        <span className="truncate text-stone-500 hidden sm:inline">{m.bourseSource}</span>
                      </div>
                    </div>

                    {/* Price and variation */}
                    <div className="text-right whitespace-nowrap shrink-0">
                      <div className="text-sm sm:text-base font-extrabold font-mono text-stone-100">
                        {displayCurrency === "MAD" ? (
                          <>
                            {m.priceMAD.toLocaleString("fr-FR")}{" "}
                            <span className="text-[11px] font-sans font-normal text-amber-500">
                              MAD
                            </span>
                          </>
                        ) : (
                          <>
                            ${m.priceUSD.toLocaleString("fr-FR")}{" "}
                            <span className="text-[11px] font-sans font-normal text-stone-400">
                              USD
                            </span>
                          </>
                        )}
                      </div>
                      <div
                        className={`text-[11px] font-semibold flex items-center justify-end gap-1 ${
                          isPositive ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="w-3 h-3 shrink-0" />
                        ) : (
                          <TrendingDown className="w-3 h-3 shrink-0" />
                        )}
                        <span>
                          {isPositive ? "+" : ""}
                          {m.changePercent}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep-Dive Chart & Moroccan Mining Specs - Bento Card */}
        <div className="lg:col-span-5 space-y-5 w-full min-w-0">
          {selectedMineral && (
            <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 backdrop-blur-sm w-full min-w-0">
              <div className="flex items-start justify-between gap-3 min-w-0">
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full inline-block mb-1">
                    Cotation Active
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-stone-100 truncate">
                    {selectedMineral.name}
                  </h2>
                  <p className="text-xs text-stone-400 truncate">
                    Source : {selectedMineral.bourseSource}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xl sm:text-2xl font-black font-mono text-stone-100 whitespace-nowrap">
                    {displayCurrency === "MAD"
                      ? `${selectedMineral.priceMAD.toLocaleString("fr-FR")} MAD`
                      : `$${selectedMineral.priceUSD.toLocaleString("fr-FR")} USD`}
                  </div>
                  <span className="text-xs text-stone-400">
                    par {selectedMineral.unit}
                  </span>
                </div>
              </div>

              {/* Chart container in Bento Dark format - bounded overflow */}
              <div className="w-full min-w-0">
                <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                  <span className="font-semibold text-stone-300">
                    Tendance 7 Jours ({displayCurrency})
                  </span>
                  <span className="text-emerald-400 font-medium">
                    {selectedMineral.changePercent >= 0 ? "+" : ""}
                    {selectedMineral.changePercent}%
                  </span>
                </div>

                <div className="h-44 w-full bg-stone-950/80 rounded-2xl p-2 border border-stone-800/80 min-w-0 overflow-hidden relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#292524" />
                      <XAxis dataKey="day" stroke="#78716c" fontSize={10} tickLine={false} />
                      <YAxis stroke="#78716c" fontSize={10} tickLine={false} domain={["auto", "auto"]} width={55} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0c0a09",
                          border: "1px solid #44403c",
                          borderRadius: "12px",
                          color: "#f5f5f4",
                          fontSize: "12px",
                        }}
                        formatter={(val: any) => [
                          displayCurrency === "MAD"
                            ? `${Number(val).toLocaleString("fr-FR")} MAD`
                            : `$${Number(val).toLocaleString("fr-FR")}`,
                          "Cours",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey={displayCurrency === "MAD" ? "priceMAD" : "priceUSD"}
                        stroke="#f59e0b"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Moroccan Geological context Bento Box */}
              <div className="bg-stone-950/70 rounded-2xl p-4 border border-stone-800/80 space-y-2.5 text-xs w-full min-w-0">
                <div className="flex items-center gap-1.5 font-bold text-stone-200 text-sm">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Bassins & Gisements Marocains</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMineral.moroccanBasins.map((basin) => (
                    <span
                      key={basin}
                      className="bg-stone-900 border border-stone-800 text-stone-300 px-2 py-0.5 rounded-lg font-medium text-[11px]"
                    >
                      {basin}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-800 text-stone-400 space-y-1">
                  <div>
                    <strong className="text-stone-300">Norme de référence :</strong> {selectedMineral.benchmarkGrade}
                  </div>
                  <div>
                    <strong className="text-stone-300">Spécifications :</strong> {selectedMineral.specifications}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lot Valuation Calculator - Bento Card with Amber Accent */}
      <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-5 sm:p-7 shadow-xl backdrop-blur-sm w-full min-w-0">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-md shadow-amber-950/50 shrink-0">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-stone-100">
              Calculateur de Valeur de Lot au Cours Réel
            </h3>
            <p className="text-xs text-stone-400">
              Estimation instantanée selon le cours officiel sélectionné ({selectedMineral?.name}).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-end w-full min-w-0">
          {/* Tonnage input */}
          <div className="space-y-1.5 min-w-0">
            <label className="text-xs font-semibold text-stone-300">
              Quantité du Lot (Tonnes)
            </label>
            <input
              type="number"
              min="1"
              step="10"
              value={calcTonnage}
              onChange={(e) => setCalcTonnage(Math.max(1, Number(e.target.value)))}
              className="w-full bg-stone-950/80 border border-stone-800 rounded-xl px-3.5 py-2 text-sm font-bold text-stone-100 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
            />
          </div>

          {/* Custom Grade ratio (%) */}
          <div className="space-y-1.5 min-w-0">
            <label className="text-xs font-semibold text-stone-300">
              Facteur de Teneur (%)
            </label>
            <input
              type="number"
              min="10"
              max="200"
              value={calcCustomGrade}
              onChange={(e) => setCalcCustomGrade(Math.max(1, Number(e.target.value)))}
              className="w-full bg-stone-950/80 border border-stone-800 rounded-xl px-3.5 py-2 text-sm font-bold text-stone-100 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
            />
            <span className="text-[10px] text-stone-500 block truncate">
              100% = Teneur de référence
            </span>
          </div>

          {/* Payability / Recovery rate */}
          <div className="space-y-1.5 min-w-0">
            <label className="text-xs font-semibold text-stone-300">
              Taux Payable Usine (%)
            </label>
            <input
              type="number"
              min="50"
              max="100"
              value={calcPayability}
              onChange={(e) => setCalcPayability(Math.min(100, Math.max(10, Number(e.target.value))))}
              className="w-full bg-stone-950/80 border border-stone-800 rounded-xl px-3.5 py-2 text-sm font-bold text-stone-100 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
            />
            <span className="text-[10px] text-stone-500 block truncate">
              Déduction normale TC/RC (90% standard)
            </span>
          </div>

          {/* Computed Output Box - Bento Accent Tile */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 p-4 rounded-xl shadow-lg space-y-1 w-full min-w-0 overflow-hidden">
            <span className="text-[10px] text-stone-900 font-extrabold uppercase tracking-wider block">
              Valeur Estimée ({calcTonnage} t)
            </span>
            <div className="text-xl sm:text-2xl font-black font-mono text-stone-950 leading-tight truncate">
              {totalLotValueMAD.toLocaleString("fr-FR")} MAD
            </div>
            <div className="text-xs text-stone-900 font-mono font-semibold truncate">
              ≈ ${totalLotValueUSD.toLocaleString("fr-FR")} USD
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
