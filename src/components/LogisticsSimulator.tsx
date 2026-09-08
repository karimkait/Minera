import React, { useState, useMemo } from "react";
import { MineralListing } from "../types";
import {
  Truck,
  MapPin,
  Anchor,
  Coins,
  ArrowRight,
  ShieldCheck,
  Calculator,
  RotateCcw,
  CheckCircle2,
  FileCheck,
  Building2,
  Info,
} from "lucide-react";

// Real-world distances (km) between Moroccan mining basins and key commercial ports/plants
interface RouteDistance {
  origin: string;
  region: string;
  destinations: { [dest: string]: number };
}

const MOROCCAN_MINING_ROUTES: RouteDistance[] = [
  {
    origin: "Bou Azzer (Ouarzazate / Zagora)",
    region: "Drâa-Tafilalet",
    destinations: {
      "Port de Casablanca": 485,
      "Port de Jorf Lasfar": 510,
      "Port d'Agadir": 390,
      "Port Nador West Med": 740,
      "Complexe Guemassa (Marrakech)": 280,
    },
  },
  {
    origin: "Zgounder / Askaoun (Taroudant)",
    region: "Souss-Massa",
    destinations: {
      "Port d'Agadir": 210,
      "Port de Casablanca": 490,
      "Port de Jorf Lasfar": 460,
      "Complexe Guemassa (Marrakech)": 250,
      "Port Nador West Med": 890,
    },
  },
  {
    origin: "Bleida (Zagora / Anti-Atlas)",
    region: "Drâa-Tafilalet",
    destinations: {
      "Port de Casablanca": 540,
      "Port de Jorf Lasfar": 570,
      "Port d'Agadir": 460,
      "Complexe Guemassa (Marrakech)": 340,
      "Port Nador West Med": 790,
    },
  },
  {
    origin: "Khouribga (Bassin Oulad Abdoun)",
    region: "Béni Mellal-Khénifra",
    destinations: {
      "Port de Jorf Lasfar": 125,
      "Port de Casablanca": 135,
      "Port d'Agadir": 470,
      "Port Nador West Med": 580,
      "Complexe Guemassa (Marrakech)": 190,
    },
  },
  {
    origin: "Midelt / Mibladen (Haute Moulouya)",
    region: "Drâa-Tafilalet",
    destinations: {
      "Port Nador West Med": 365,
      "Port de Casablanca": 390,
      "Port de Jorf Lasfar": 435,
      "Complexe Guemassa (Marrakech)": 380,
      "Port d'Agadir": 620,
    },
  },
  {
    origin: "Zelmou / Bouarfa (Barytine)",
    region: "Oriental",
    destinations: {
      "Port Nador West Med": 430,
      "Port de Casablanca": 640,
      "Port de Jorf Lasfar": 690,
      "Port d'Agadir": 870,
      "Complexe Guemassa (Marrakech)": 620,
    },
  },
  {
    origin: "Jerada / Touissit (Plomb & Zinc)",
    region: "Oriental",
    destinations: {
      "Port Nador West Med": 185,
      "Port de Casablanca": 590,
      "Port de Jorf Lasfar": 640,
      "Port d'Agadir": 890,
      "Complexe Guemassa (Marrakech)": 650,
    },
  },
  {
    origin: "Youssoufia / Gantour",
    region: "Marrakech-Safi",
    destinations: {
      "Port de Jorf Lasfar": 140,
      "Port de Casablanca": 230,
      "Port d'Agadir": 290,
      "Port Nador West Med": 720,
      "Complexe Guemassa (Marrakech)": 90,
    },
  },
];

interface LogisticsSimulatorProps {
  listings: MineralListing[];
  usdToMadRate: number;
  onSelectLotToView?: (lot: MineralListing) => void;
}

export const LogisticsSimulator: React.FC<LogisticsSimulatorProps> = ({
  listings,
  usdToMadRate,
  onSelectLotToView,
}) => {
  // Simulator configuration state
  const [selectedOrigin, setSelectedOrigin] = useState<string>(MOROCCAN_MINING_ROUTES[0].origin);
  const [selectedDestination, setSelectedDestination] = useState<string>("Port de Casablanca");
  const [tonnage, setTonnage] = useState<number>(500);
  const [truckType, setTruckType] = useState<"benne30" | "semi45" | "train">("benne30");
  const [baseExwPriceMAD, setBaseExwPriceMAD] = useState<number>(8500); // Price EXW Mine (MAD/t)
  const [includePortHandling, setIncludePortHandling] = useState<boolean>(true);
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(true);

  // Selected preset lot if user wants to load from an actual listing
  const [selectedLotId, setSelectedLotId] = useState<string>("");

  const handleApplyLot = (lotId: string) => {
    setSelectedLotId(lotId);
    const lot = listings.find((l) => l.id === lotId);
    if (!lot) return;

    setTonnage(lot.quantityNumber || 500);
    setBaseExwPriceMAD(lot.priceMAD || 5000);

    // Try matching origin location
    const matchedOrigin = MOROCCAN_MINING_ROUTES.find(
      (r) =>
        r.origin.toLowerCase().includes(lot.location.toLowerCase()) ||
        lot.location.toLowerCase().includes(r.origin.split(" ")[0].toLowerCase())
    );
    if (matchedOrigin) {
      setSelectedOrigin(matchedOrigin.origin);
    }

    if (lot.incoterm.includes("Jorf Lasfar")) {
      setSelectedDestination("Port de Jorf Lasfar");
    } else if (lot.incoterm.includes("Nador")) {
      setSelectedDestination("Port Nador West Med");
    } else if (lot.incoterm.includes("Agadir")) {
      setSelectedDestination("Port d'Agadir");
    } else {
      setSelectedDestination("Port de Casablanca");
    }
  };

  // Find distance for current origin and destination
  const currentRoute = MOROCCAN_MINING_ROUTES.find((r) => r.origin === selectedOrigin);
  const distanceKm = currentRoute?.destinations[selectedDestination] || 450;

  // Truck details
  const truckSpecs = {
    benne30: { name: "Camion Benne Minier (30 Tonnes)", capacity: 30, ratePerTonneKm: 0.62 },
    semi45: { name: "Semi-remorque Bâché Vrac (45 Tonnes)", capacity: 45, ratePerTonneKm: 0.54 },
    train: { name: "Convoi Ferroviaire Minier ONCF (500 Tonnes)", capacity: 500, ratePerTonneKm: 0.38 },
  };

  const selectedTruck = truckSpecs[truckType];

  // Logistics cost calculations
  const calculation = useMemo(() => {
    const requiredRotations = Math.ceil(tonnage / selectedTruck.capacity);
    // Base freight cost
    const freightCostTotalMAD = Math.round(tonnage * distanceKm * selectedTruck.ratePerTonneKm);
    const freightCostPerTonneMAD = Math.round((freightCostTotalMAD / tonnage) * 10) / 10;

    // Weighbridge (Pont-bascule) fee: 50 MAD per truck trip
    const weighbridgeFeeTotalMAD = requiredRotations * 50;

    // Port handling & stevedoring (Acconage quai minéralier): approx 65 MAD/tonne
    const portHandlingMAD = includePortHandling ? tonnage * 65 : 0;

    // Customs transit declaration & insurance: approx 0.4% of cargo value + 1200 MAD doc
    const cargoValue = tonnage * baseExwPriceMAD;
    const insuranceAndCustomsMAD = includeInsurance ? Math.round(cargoValue * 0.0035 + 1500) : 0;

    // Total logistics overhead
    const totalLogisticsCostMAD =
      freightCostTotalMAD + weighbridgeFeeTotalMAD + portHandlingMAD + insuranceAndCustomsMAD;
    const logisticsCostPerTonneMAD = Math.round((totalLogisticsCostMAD / tonnage) * 10) / 10;

    // Derived FOB Price (EXW + Logistics)
    const fobPricePerTonneMAD = Math.round((baseExwPriceMAD + logisticsCostPerTonneMAD) * 10) / 10;
    const fobPricePerTonneUSD = Math.round((fobPricePerTonneMAD / (usdToMadRate || 9.94)) * 10) / 10;

    const totalFobValueMAD = Math.round(fobPricePerTonneMAD * tonnage);
    const totalFobValueUSD = Math.round(totalFobValueMAD / (usdToMadRate || 9.94));

    const logisticsSharePercent = Math.round((logisticsCostPerTonneMAD / fobPricePerTonneMAD) * 100);

    return {
      requiredRotations,
      freightCostTotalMAD,
      freightCostPerTonneMAD,
      weighbridgeFeeTotalMAD,
      portHandlingMAD,
      insuranceAndCustomsMAD,
      totalLogisticsCostMAD,
      logisticsCostPerTonneMAD,
      fobPricePerTonneMAD,
      fobPricePerTonneUSD,
      totalFobValueMAD,
      totalFobValueUSD,
      logisticsSharePercent,
    };
  }, [
    tonnage,
    distanceKm,
    selectedTruck,
    baseExwPriceMAD,
    includePortHandling,
    includeInsurance,
    usdToMadRate,
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full min-w-0">
      {/* Top Banner Header */}
      <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full">
                <Truck className="w-3.5 h-3.5" />
                Fret Minier & Réseau Routier National
              </span>
              <span className="text-xs text-stone-400 hidden sm:inline">
                Barème transporteurs agréés & ONCF
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-100 tracking-tight">
              Simulateur Logistique & Fret Minier Marocain
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Calculez précisément les coûts de transport par camion ou train depuis les carrières de l'intérieur jusqu'aux quais minéraliers, et convertissez votre prix Ex-Mine (EXW) en prix FOB Export.
            </p>
          </div>

          {/* Quick preset lot selector */}
          <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800 space-y-1.5 min-w-[240px]">
            <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Charger un lot existant
            </label>
            <select
              value={selectedLotId}
              onChange={(e) => handleApplyLot(e.target.value)}
              className="w-full bg-stone-900 border border-stone-700 text-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="">-- Sélectionner un lot --</option>
              {listings.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title.slice(0, 32)}... ({l.quantity})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Parameters on Left, Simulation Breakdown on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 backdrop-blur-sm">
            <h2 className="text-base sm:text-lg font-bold text-stone-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              <span>Itinéraire & Origine Minérale</span>
            </h2>

            {/* Basin selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">
                Gisement Minier / Carreau d'Origine
              </label>
              <select
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value)}
                className="w-full bg-stone-950/80 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-stone-100 focus:outline-none focus:border-amber-500"
              >
                {MOROCCAN_MINING_ROUTES.map((route) => (
                  <option key={route.origin} value={route.origin}>
                    {route.origin} • Région {route.region}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination port */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">
                Port Minéralier ou Usine de Traitement
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full bg-stone-950/80 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-stone-100 focus:outline-none focus:border-amber-500"
              >
                {currentRoute &&
                  Object.keys(currentRoute.destinations).map((dest) => (
                    <option key={dest} value={dest}>
                      {dest} ({currentRoute.destinations[dest]} km)
                    </option>
                  ))}
              </select>
            </div>

            {/* Distance badge */}
            <div className="bg-stone-950/80 rounded-2xl p-3.5 border border-stone-800/80 flex items-center justify-between text-xs">
              <span className="text-stone-400">Distance routière estimée :</span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                {distanceKm} km (Aller simple)
              </span>
            </div>

            <div className="pt-3 border-t border-stone-800 space-y-4">
              <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-500" />
                <span>Paramètres de Tonnage & Transport</span>
              </h3>

              {/* Tonnage input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">
                    Tonnage Total du Lot (Tonnes)
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="50"
                    value={tonnage}
                    onChange={(e) => setTonnage(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl px-3.5 py-2 text-sm font-bold text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-300">
                    Prix de Départ EXW Mine (MAD / t)
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="500"
                    value={baseExwPriceMAD}
                    onChange={(e) => setBaseExwPriceMAD(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl px-3.5 py-2 text-sm font-bold text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* Truck Fleet Type Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-300">
                  Mode de Transport Prévu
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setTruckType("benne30")}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      truckType === "benne30"
                        ? "bg-amber-500/15 border-amber-500 text-stone-100 font-bold"
                        : "bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    <div className="font-semibold text-stone-200 text-xs">Camion Benne 30t</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">0.62 MAD / t / km</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTruckType("semi45")}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      truckType === "semi45"
                        ? "bg-amber-500/15 border-amber-500 text-stone-100 font-bold"
                        : "bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    <div className="font-semibold text-stone-200 text-xs">Semi-remorque 45t</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">0.54 MAD / t / km</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTruckType("train")}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      truckType === "train"
                        ? "bg-amber-500/15 border-amber-500 text-stone-100 font-bold"
                        : "bg-stone-950/60 border-stone-800 text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    <div className="font-semibold text-stone-200 text-xs">Convoi ONCF Train</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">0.38 MAD / t / km</div>
                  </button>
                </div>
              </div>

              {/* Checkbox Options */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePortHandling}
                    onChange={(e) => setIncludePortHandling(e.target.checked)}
                    className="rounded border-stone-700 text-amber-500 focus:ring-amber-500 bg-stone-950"
                  />
                  <span>Acconage & Manutention Portuaire (65 DH/t)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeInsurance}
                    onChange={(e) => setIncludeInsurance(e.target.checked)}
                    className="rounded border-stone-700 text-amber-500 focus:ring-amber-500 bg-stone-950"
                  />
                  <span>Assurance Transit & Frais Douane</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Computed Logistics Results */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Hero Card: FOB Conversion Result */}
          <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-0.5 rounded-full inline-block mb-1.5">
                  Recommandation Prix FOB Export
                </span>
                <h3 className="text-lg font-bold text-stone-100">
                  Prix Rendu {selectedDestination.replace("Port de ", "")}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400">
                  {calculation.fobPricePerTonneMAD.toLocaleString("fr-FR")}{" "}
                  <span className="text-xs font-sans font-normal text-stone-300">MAD / t</span>
                </div>
                <div className="text-xs font-mono text-stone-400">
                  ≈ ${calculation.fobPricePerTonneUSD.toLocaleString("fr-FR")} USD / Tonne
                </div>
              </div>
            </div>

            {/* Visual Value Split Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-stone-400">
                <span>Valeur Minérale EXW ({100 - calculation.logisticsSharePercent}%)</span>
                <span>Part Logistique & Fret ({calculation.logisticsSharePercent}%)</span>
              </div>
              <div className="h-3.5 w-full bg-stone-950 rounded-full overflow-hidden flex border border-stone-800">
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${100 - calculation.logisticsSharePercent}%` }}
                  title="Valeur EXW"
                />
                <div
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${calculation.logisticsSharePercent}%` }}
                  title="Coûts logistiques"
                />
              </div>
            </div>

            {/* Granular Cost Breakdown Table */}
            <div className="bg-stone-950/80 rounded-2xl p-4 border border-stone-800/80 space-y-3 text-xs">
              <div className="font-bold text-stone-200 border-b border-stone-800 pb-2 flex items-center justify-between">
                <span>Décomposition Financière du Convoi</span>
                <span className="text-amber-400 font-mono">{calculation.requiredRotations} Rotations nécessaires</span>
              </div>

              <div className="flex justify-between text-stone-300">
                <span className="text-stone-400">Fret Routier ({distanceKm} km x {tonnage} t) :</span>
                <span className="font-mono font-semibold">
                  {calculation.freightCostTotalMAD.toLocaleString("fr-FR")} MAD{" "}
                  <span className="text-[11px] text-stone-500">({calculation.freightCostPerTonneMAD} DH/t)</span>
                </span>
              </div>

              <div className="flex justify-between text-stone-300">
                <span className="text-stone-400">Pesage Pont-Bascule ({calculation.requiredRotations} passages) :</span>
                <span className="font-mono font-semibold">
                  {calculation.weighbridgeFeeTotalMAD.toLocaleString("fr-FR")} MAD
                </span>
              </div>

              {includePortHandling && (
                <div className="flex justify-between text-stone-300">
                  <span className="text-stone-400">Acconage & Manutention Portuaire :</span>
                  <span className="font-mono font-semibold">
                    {calculation.portHandlingMAD.toLocaleString("fr-FR")} MAD
                  </span>
                </div>
              )}

              {includeInsurance && (
                <div className="flex justify-between text-stone-300">
                  <span className="text-stone-400">Assurance Ad Valorem & Douanes :</span>
                  <span className="font-mono font-semibold">
                    {calculation.insuranceAndCustomsMAD.toLocaleString("fr-FR")} MAD
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-stone-800 flex justify-between font-bold text-stone-100 text-sm">
                <span>Total Coûts Logistiques :</span>
                <span className="font-mono text-blue-400">
                  {calculation.totalLogisticsCostMAD.toLocaleString("fr-FR")} MAD{" "}
                  <span className="text-xs text-stone-400">({calculation.logisticsCostPerTonneMAD} DH/t)</span>
                </span>
              </div>
            </div>

            {/* Total Cargo Value summary */}
            <div className="bg-stone-950/60 rounded-2xl p-4 border border-stone-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-400 block">Valeur Totale du Lot Rendu Port ({tonnage} t)</span>
                <div className="text-xl font-bold font-mono text-stone-100">
                  {calculation.totalFobValueMAD.toLocaleString("fr-FR")} MAD
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-400 block">Équivalent USD</span>
                <div className="text-xl font-bold font-mono text-emerald-400">
                  ${calculation.totalFobValueUSD.toLocaleString("fr-FR")} USD
                </div>
              </div>
            </div>

            <div className="text-[11px] text-stone-400 flex items-start gap-2 bg-stone-900/60 p-3 rounded-xl border border-stone-800">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                Ces estimations tiennent compte des barèmes réels pratiqués sur les corridors miniers marocains (Route Nationale N9, N10, autoroutes A1, A3). Les tarifs réels peuvent varier de ±5% selon la saisonnalité et la disponibilité des bennes.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
