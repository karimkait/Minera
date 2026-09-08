import React from "react";
import {
  Pickaxe,
  TrendingUp,
  Camera,
  FileSpreadsheet,
  PlusCircle,
  RefreshCw,
  Coins,
  ShieldCheck,
  Compass,
  Sun,
  SunMedium,
  Briefcase,
  Scale,
  Truck,
} from "lucide-react";
import { BourseData } from "../types";
import { useSunlightMode } from "../context/SunlightModeContext";

export type TabType =
  | "marketplace"
  | "bourse"
  | "rfq"
  | "comparator"
  | "logistics"
  | "recognizer"
  | "lab-reader"
  | "deposits";

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenAddModal: () => void;
  bourseData: BourseData | null;
  onRefreshBourse: () => void;
  isLoadingBourse: boolean;
  comparedCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  bourseData,
  onRefreshBourse,
  isLoadingBourse,
  comparedCount = 0,
}) => {
  const { isSunlightMode, toggleSunlightMode } = useSunlightMode();

  return (
    <header className="bg-stone-950/95 backdrop-blur-md text-stone-100 border-b border-stone-800 sticky top-0 z-40 shadow-2xl">
      {/* Live Market Ticker bar - Bento pill style */}
      <div className="bg-stone-900/90 border-b border-stone-800/80 text-xs text-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-3 w-full">
          {/* BAM rate badge */}
          <div className="flex items-center gap-1.5 text-amber-400 font-bold bg-stone-950 border border-stone-700/80 px-2.5 py-1 rounded-full shadow-sm shrink-0 text-[11px]">
            <Coins className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-stone-300 hidden sm:inline">Bank Al-Maghrib:</span>
            <span className="text-stone-300 sm:hidden">BAM:</span>
            <span className="text-amber-300 font-mono font-black">
              1$ = {bourseData?.usdToMadRate ? bourseData.usdToMadRate.toFixed(3) : "9.940"} DH
            </span>
          </div>

          {/* Key tickers with clean scroll on small screens, no native scrollbar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 min-w-0 flex-1">
            <span className="flex items-center gap-1.5 bg-stone-950/90 border border-stone-700/70 px-2.5 py-0.5 rounded-full text-[11px] shrink-0">
              <span className="text-stone-300 font-medium">Phosphate OCP:</span>
              <strong className="text-stone-100 font-mono font-bold">148.5 $</strong>
              <span className="text-emerald-400 font-mono text-[10px] font-bold">+1.35%</span>
            </span>

            <span className="flex items-center gap-1.5 bg-stone-950/90 border border-stone-700/70 px-2.5 py-0.5 rounded-full text-[11px] shrink-0">
              <span className="text-stone-300 font-medium">Argent LBMA:</span>
              <strong className="text-stone-100 font-mono font-bold">31.85 $/oz</strong>
              <span className="text-emerald-400 font-mono text-[10px] font-bold">+2.18%</span>
            </span>

            <span className="flex items-center gap-1.5 bg-stone-950/90 border border-stone-700/70 px-2.5 py-0.5 rounded-full text-[11px] shrink-0">
              <span className="text-stone-300 font-medium">Cobalt Bou Azzer:</span>
              <strong className="text-amber-300 font-mono font-bold">28 450 $/t</strong>
              <span className="text-stone-400 font-mono text-[10px] font-semibold">-0.45%</span>
            </span>

            <span className="flex items-center gap-1.5 bg-stone-950/90 border border-stone-700/70 px-2.5 py-0.5 rounded-full text-[11px] shrink-0">
              <span className="text-stone-300 font-medium">Cuivre LME:</span>
              <strong className="text-amber-300 font-mono font-bold">9 480 $/t</strong>
              <span className="text-emerald-400 font-mono text-[10px] font-bold">+1.12%</span>
            </span>
          </div>

          {/* Right indicator & refresh button (always pinned in view) */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden lg:inline-flex items-center gap-1.5 bg-stone-950 border border-stone-700/80 px-2.5 py-0.5 rounded-full text-[10px] text-stone-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Direct LME/OCP</span>
            </div>
            <button
              onClick={onRefreshBourse}
              title="Rafraîchir les cours de bourse"
              className="text-stone-300 hover:text-stone-100 transition p-1 hover:bg-stone-800 rounded-lg border border-stone-700 hover:border-stone-600 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingBourse ? "animate-spin text-amber-400" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 flex-wrap lg:flex-nowrap">
        {/* Brand identity */}
        <div
          onClick={() => setActiveTab("marketplace")}
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-md shadow-amber-950/50">
            <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center group-hover:bg-stone-900 transition">
              <Pickaxe className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-stone-100">
                Minéra<span className="text-amber-500">Maroc</span>
              </span>
              <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                Marché Officiel
              </span>
            </div>
            <p className="text-[10px] text-stone-400 font-medium hidden sm:block">
              Bourse & Marketplace des Minerais au Maroc
            </p>
          </div>
        </div>

        {/* Primary nav tabs in Bento Pill style - compact & space-efficient */}
        <nav className="flex items-center gap-1 bg-stone-900/90 p-1 rounded-xl border border-stone-700/80 shadow-inner overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab("marketplace")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer whitespace-nowrap ${
              activeTab === "marketplace"
                ? "bg-amber-500 text-stone-950 shadow-sm font-bold"
                : "text-stone-300 hover:text-stone-100 hover:bg-stone-800/80 font-medium"
            }`}
          >
            <Pickaxe className="w-3.5 h-3.5 shrink-0" />
            <span>Lots & Minerais</span>
          </button>

          <button
            onClick={() => setActiveTab("bourse")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer whitespace-nowrap ${
              activeTab === "bourse"
                ? "bg-amber-500 text-stone-950 shadow-sm font-bold"
                : "text-stone-300 hover:text-stone-100 hover:bg-stone-800/80 font-medium"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 shrink-0" />
            <span>Bourse en Direct</span>
          </button>

          <button
            onClick={() => setActiveTab("rfq")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer whitespace-nowrap ${
              activeTab === "rfq"
                ? "bg-amber-500 text-stone-950 shadow-sm font-bold"
                : "text-stone-300 hover:text-stone-100 hover:bg-stone-800/80 font-medium"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 shrink-0" />
            <span>Demandes d'Achat</span>
          </button>

          <button
            onClick={() => setActiveTab("comparator")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer whitespace-nowrap relative ${
              activeTab === "comparator"
                ? "bg-amber-500 text-stone-950 shadow-sm font-bold"
                : "text-stone-300 hover:text-stone-100 hover:bg-stone-800/80 font-medium"
            }`}
          >
            <Scale className="w-3.5 h-3.5 shrink-0" />
            <span>Comparateur</span>
            {comparedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-stone-950 text-amber-400 border border-amber-500/40">
                {comparedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("logistics")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer whitespace-nowrap ${
              activeTab === "logistics"
                ? "bg-amber-500 text-stone-950 shadow-sm font-bold"
                : "text-stone-300 hover:text-stone-100 hover:bg-stone-800/80 font-medium"
            }`}
          >
            <Truck className="w-3.5 h-3.5 shrink-0" />
            <span>Simulateur Fret</span>
          </button>

          <button
            onClick={() => setActiveTab("deposits")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer whitespace-nowrap ${
              activeTab === "deposits"
                ? "bg-amber-500 text-stone-950 shadow-sm font-bold"
                : "text-stone-300 hover:text-stone-100 hover:bg-stone-800/80 font-medium"
            }`}
          >
            <Compass className="w-3.5 h-3.5 shrink-0" />
            <span>Gisements</span>
          </button>

          <button
            onClick={() => setActiveTab("recognizer")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer whitespace-nowrap ${
              activeTab === "recognizer"
                ? "bg-amber-500 text-stone-950 shadow-sm font-bold"
                : "text-stone-300 hover:text-stone-100 hover:bg-stone-800/80 font-medium"
            }`}
          >
            <Camera className="w-3.5 h-3.5 shrink-0" />
            <span>IA Vision</span>
          </button>

          <button
            onClick={() => setActiveTab("lab-reader")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer whitespace-nowrap ${
              activeTab === "lab-reader"
                ? "bg-amber-500 text-stone-950 shadow-sm font-bold"
                : "text-stone-300 hover:text-stone-100 hover:bg-stone-800/80 font-medium"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
            <span>Labo</span>
          </button>
        </nav>

        {/* CTA Buttons & Sunlight Mode Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Outdoor Sunlight Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleSunlightMode}
            title={
              isSunlightMode
                ? "Désactiver le Mode Plein Soleil (revenir au mode sombre studio)"
                : "Activer le Mode Plein Soleil / Terrain (anti-reflet, contrastes 12:1 WCAG AAA pour utilisation sur concession minière)"
            }
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition border cursor-pointer select-none ${
              isSunlightMode
                ? "bg-amber-400 hover:bg-amber-300 text-stone-950 border-amber-500 shadow-sm ring-1 ring-amber-500/50"
                : "bg-stone-900 hover:bg-stone-800 text-amber-400 border-stone-700 hover:border-amber-500/60"
            }`}
          >
            {isSunlightMode ? (
              <>
                <SunMedium className="w-3.5 h-3.5 text-stone-950 animate-spin" style={{ animationDuration: "12s" }} />
                <span className="hidden sm:inline">Plein Soleil</span>
                <span className="sm:hidden">Soleil</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Plein Soleil</span>
                <span className="sm:hidden">Soleil</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold px-3 py-1.5 rounded-xl text-xs transition shadow-md shadow-amber-950/40 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-3.5 h-3.5 text-stone-950 shrink-0" />
            <span>Publier un Lot</span>
          </button>
        </div>
      </div>
    </header>
  );
};

