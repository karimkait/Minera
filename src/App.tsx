import React, { useState, useEffect } from "react";
import {
  MineralListing,
  BourseData,
  MineralIdentificationResult,
  TechnicalReportAnalysis,
  BuyerRequest,
} from "./types";
import { INITIAL_MINERAL_LISTINGS } from "./data/initialListings";
import { INITIAL_BUYER_REQUESTS } from "./data/initialBuyerRequests";
import { Header, TabType } from "./components/Header";
import { MarketplaceListings } from "./components/MarketplaceListings";
import { BourseDashboard } from "./components/BourseDashboard";
import { MineralIdentifier } from "./components/MineralIdentifier";
import { TechnicalAnalysisReader } from "./components/TechnicalAnalysisReader";
import { MoroccanDepositsGuide } from "./components/MoroccanDepositsGuide";
import { BuyerRequestsView } from "./components/BuyerRequestsView";
import { LotComparator } from "./components/LotComparator";
import { LogisticsSimulator } from "./components/LogisticsSimulator";
import { ShippingSlipModal } from "./components/ShippingSlipModal";
import { AddListingModal } from "./components/AddListingModal";
import { LotDetailsModal } from "./components/LotDetailsModal";
import { ContactSellerModal } from "./components/ContactSellerModal";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Pickaxe,
  TrendingUp,
  Camera,
  FileSpreadsheet,
  Sun,
  Scale,
  Briefcase,
  Truck,
  FileText,
} from "lucide-react";
import { SunlightModeProvider, useSunlightMode } from "./context/SunlightModeContext";

function MainApp() {
  const [activeTab, setActiveTab] = useState<TabType>("marketplace");

  const { isSunlightMode, toggleSunlightMode } = useSunlightMode();

  // Listings state with localStorage persistence
  const [listings, setListings] = useState<MineralListing[]>(() => {
    const saved = localStorage.getItem("mineramaroc_listings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved listings", e);
      }
    }
    return INITIAL_MINERAL_LISTINGS;
  });

  // Buyer Requests / RFQ state with localStorage persistence
  const [buyerRequests, setBuyerRequests] = useState<BuyerRequest[]>(() => {
    const saved = localStorage.getItem("mineramaroc_buyer_requests");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved buyer requests", e);
      }
    }
    return INITIAL_BUYER_REQUESTS;
  });

  // Compared lots state with localStorage persistence (default first 2 lots for immediate discovery)
  const [comparedLotIds, setComparedLotIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("mineramaroc_compared_lots");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse compared lots", e);
      }
    }
    return ["lot-1", "lot-2"];
  });

  // Bourse live state
  const [bourseData, setBourseData] = useState<BourseData | null>(null);
  const [isLoadingBourse, setIsLoadingBourse] = useState<boolean>(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLotForDetails, setSelectedLotForDetails] = useState<MineralListing | null>(null);
  const [selectedLotForContact, setSelectedLotForContact] = useState<MineralListing | null>(null);
  const [prefillAddListing, setPrefillAddListing] = useState<Partial<MineralListing> | undefined>(undefined);

  // Official Shipping Slip Modal state
  const [selectedLotForShippingSlip, setSelectedLotForShippingSlip] = useState<MineralListing | null>(null);
  const [isShippingSlipOpen, setIsShippingSlipOpen] = useState(false);

  // Feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem("mineramaroc_listings", JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem("mineramaroc_buyer_requests", JSON.stringify(buyerRequests));
  }, [buyerRequests]);

  useEffect(() => {
    localStorage.setItem("mineramaroc_compared_lots", JSON.stringify(comparedLotIds));
  }, [comparedLotIds]);

  // Comparison Handlers
  const handleToggleCompare = (lotId: string) => {
    setComparedLotIds((prev) => {
      if (prev.includes(lotId)) {
        showToast("Lot retiré du comparateur.");
        return prev.filter((id) => id !== lotId);
      }
      if (prev.length >= 4) {
        showToast("Maximum 4 lots comparables simultanément.");
        return prev;
      }
      showToast("Lot ajouté au comparateur côte-à-côte !");
      return [...prev, lotId];
    });
  };

  const handleRemoveFromCompare = (lotId: string) => {
    setComparedLotIds((prev) => prev.filter((id) => id !== lotId));
  };

  const handleClearCompare = () => {
    setComparedLotIds([]);
    showToast("Le comparateur a été réinitialisé.");
  };

  const handleAddLotToCompare = (lotId: string) => {
    if (comparedLotIds.includes(lotId)) return;
    if (comparedLotIds.length >= 4) {
      showToast("Maximum 4 lots comparables simultanément.");
      return;
    }
    setComparedLotIds((prev) => [...prev, lotId]);
    showToast("Lot ajouté à la comparaison.");
  };

  // Shipping slip opener
  const handleOpenShippingSlip = (lot: MineralListing) => {
    setSelectedLotForShippingSlip(lot);
    setIsShippingSlipOpen(true);
  };

  // Transition to Logistics simulator
  const handleSimulateLogistics = (lot: MineralListing) => {
    setActiveTab("logistics");
    showToast(`Simulation logistique prête pour le lot : ${lot.title}`);
  };

  // Handler: Add new buyer request
  const handleAddBuyerRequest = (newReq: BuyerRequest) => {
    setBuyerRequests((prev) => [newReq, ...prev]);
  };

  // Fetch real-time Bourse data
  const fetchBourseData = async () => {
    setIsLoadingBourse(true);
    try {
      const res = await fetch("/api/bourse-quotes");
      const json = await res.json();
      if (json.success && json.data) {
        setBourseData(json.data);
      }
    } catch (e) {
      console.error("Failed to load bourse quotes", e);
    } finally {
      setIsLoadingBourse(false);
    }
  };

  useEffect(() => {
    fetchBourseData();
    const interval = setInterval(fetchBourseData, 180000);
    return () => clearInterval(interval);
  }, []);

  // Handler: Add new listing
  const handleAddListing = (newLot: MineralListing) => {
    setListings((prev) => [newLot, ...prev]);
    showToast(`L'offre "${newLot.title}" a été publiée avec succès sur MinéraMaroc !`);
  };

  // Handler: Transition from AI Rock Recognition to Listing Modal
  const handleAddListingFromRecognition = (result: MineralIdentificationResult) => {
    setPrefillAddListing({
      title: `Minerai de ${result.commonName} (${result.mineralClass})`,
      category: result.commonName.toLowerCase().includes("cobalt")
        ? "cobalt"
        : result.commonName.toLowerCase().includes("cuivre") || result.commonName.toLowerCase().includes("chalco") || result.commonName.toLowerCase().includes("malachite")
        ? "cuivre"
        : result.commonName.toLowerCase().includes("argent")
        ? "argent"
        : result.commonName.toLowerCase().includes("phosphate")
        ? "phosphate"
        : result.commonName.toLowerCase().includes("baryte") || result.commonName.toLowerCase().includes("barytine")
        ? "barite"
        : result.commonName.toLowerCase().includes("zinc")
        ? "zinc"
        : result.commonName.toLowerCase().includes("plomb") || result.commonName.toLowerCase().includes("galène")
        ? "plomb"
        : "autre",
      grade: result.marketValuation.estimatedGrade,
      location: result.moroccanDeposits[0]?.site || "Maroc",
      region: result.moroccanDeposits[0]?.region || "Drâa-Tafilalet",
      description: `${result.visualDescription}. Identifié par IA minéralogique. Formule: ${result.chemicalFormula}.`,
      hasCertifiedLabReport: false,
    });
    setIsAddModalOpen(true);
  };

  // Handler: Transition from Lab Report Analysis to Listing Modal
  const handleAddListingFromReport = (report: TechnicalReportAnalysis) => {
    const mainGrade = report.mainPayableElements[0]?.grade || "Teneur certifiée";
    const elemName = report.mainPayableElements[0]?.element || "Métal";

    setPrefillAddListing({
      title: `Lot Certifié : ${report.primaryMineralType} (${mainGrade})`,
      category: report.primaryMineralType.toLowerCase().includes("cobalt")
        ? "cobalt"
        : report.primaryMineralType.toLowerCase().includes("cuivre")
        ? "cuivre"
        : report.primaryMineralType.toLowerCase().includes("argent")
        ? "argent"
        : report.primaryMineralType.toLowerCase().includes("phosphate")
        ? "phosphate"
        : report.primaryMineralType.toLowerCase().includes("barytine")
        ? "barite"
        : "autre",
      grade: `${mainGrade} ${elemName}`,
      priceMAD: report.commercialVerdict.estimatedValueMADPerTonne || 15000,
      hasCertifiedLabReport: true,
      labName: report.labInfo.laboratoryName,
      description: `${report.commercialVerdict.valuationSummary}. Bulletin certifié n° ${report.labInfo.certificateNumber}. Méthode: ${report.labInfo.analyticalMethod}.`,
      chemicalAssay: {
        primaryGrade: mainGrade,
        secondaryElements: report.mainPayableElements.map((e) => `${e.element}: ${e.grade}`).join(", "),
        moisture: report.physicalParameters.moisture,
        impurities: report.penaltyAndImpurities.map((p) => `${p.element}: ${p.content}`).join(", "),
      },
    });
    setIsAddModalOpen(true);
  };

  const usdToMadRate = bourseData?.usdToMadRate || 9.94;

  return (
    <div className={`min-h-screen w-full overflow-x-hidden flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200 transition-colors duration-200 ${isSunlightMode ? "sunlight-mode bg-slate-100 text-slate-900" : "bg-stone-950 text-stone-100"}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 border border-stone-800 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in text-xs max-w-sm backdrop-blur-md">
          <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => {
          setPrefillAddListing(undefined);
          setIsAddModalOpen(true);
        }}
        bourseData={bourseData}
        onRefreshBourse={fetchBourseData}
        isLoadingBourse={isLoadingBourse}
        comparedCount={comparedLotIds.length}
      />

      {/* High-visibility Sunlight Mode Field Banner */}
      {isSunlightMode && (
        <aside aria-label="Bandeau statut plein soleil" className="bg-amber-400 text-stone-950 px-4 py-1.5 text-xs font-bold border-b border-amber-500 shadow-sm flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-stone-950 shrink-0" />
              <span>
                <strong>Mode Plein Soleil Activé :</strong> Contrastes 12:1 WCAG AAA, surfaces antireflet et données géochimiques lisibles en plein soleil de carrière.
              </span>
            </div>
            <button
              onClick={toggleSunlightMode}
              className="text-stone-950 font-black text-xs underline hover:text-stone-800 cursor-pointer shrink-0"
            >
              Mode Normal
            </button>
          </div>
        </aside>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-w-0">
        {activeTab === "marketplace" && (
          <MarketplaceListings
            listings={listings}
            onOpenLotDetails={(lot) => setSelectedLotForDetails(lot)}
            onContactSeller={(lot) => setSelectedLotForContact(lot)}
            onOpenAddModal={() => {
              setPrefillAddListing(undefined);
              setIsAddModalOpen(true);
            }}
            usdToMadRate={usdToMadRate}
            onNavigateToDeposits={() => setActiveTab("deposits")}
            comparedLotIds={comparedLotIds}
            onToggleCompareLot={handleToggleCompare}
            onNavigateToComparator={() => setActiveTab("comparator")}
            onOpenShippingSlip={handleOpenShippingSlip}
          />
        )}

        {activeTab === "bourse" && (
          <BourseDashboard
            bourseData={bourseData}
            isLoading={isLoadingBourse}
            onRefresh={fetchBourseData}
          />
        )}

        {activeTab === "rfq" && (
          <BuyerRequestsView
            buyerRequests={buyerRequests}
            onAddBuyerRequest={handleAddBuyerRequest}
            listings={listings}
            usdToMadRate={usdToMadRate}
            onToast={showToast}
          />
        )}

        {activeTab === "comparator" && (
          <LotComparator
            allListings={listings}
            comparedLotIds={comparedLotIds}
            onRemoveFromCompare={handleRemoveFromCompare}
            onClearCompare={handleClearCompare}
            onAddLotToCompare={handleAddLotToCompare}
            onOpenLotDetails={(lot) => setSelectedLotForDetails(lot)}
            onContactSeller={(lot) => setSelectedLotForContact(lot)}
            onOpenShippingSlip={handleOpenShippingSlip}
            onSimulateLogistics={handleSimulateLogistics}
            usdToMadRate={usdToMadRate}
          />
        )}

        {activeTab === "logistics" && (
          <LogisticsSimulator
            listings={listings}
            usdToMadRate={usdToMadRate}
            onSelectLotToView={(lot) => setSelectedLotForDetails(lot)}
          />
        )}

        {activeTab === "recognizer" && (
          <MineralIdentifier
            onAddListingFromRecognition={handleAddListingFromRecognition}
          />
        )}

        {activeTab === "lab-reader" && (
          <TechnicalAnalysisReader
            onAddListingFromReport={handleAddListingFromReport}
          />
        )}

        {activeTab === "deposits" && (
          <MoroccanDepositsGuide
            onNavigateToMarketplace={(location, category) => {
              setActiveTab("marketplace");
              if (location) {
                showToast(`Filtrage de la Marketplace sur les lots de ${location}`);
              }
            }}
          />
        )}
      </main>

      {/* Modals */}
      <AddListingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddListing={handleAddListing}
        prefillData={prefillAddListing}
      />

      <LotDetailsModal
        lot={selectedLotForDetails}
        onClose={() => setSelectedLotForDetails(null)}
        onContact={(lot) => setSelectedLotForContact(lot)}
        usdToMadRate={usdToMadRate}
        onOpenShippingSlip={handleOpenShippingSlip}
        onSimulateLogistics={handleSimulateLogistics}
        isCompared={selectedLotForDetails ? comparedLotIds.includes(selectedLotForDetails.id) : false}
        onToggleCompare={handleToggleCompare}
      />

      <ShippingSlipModal
        lot={selectedLotForShippingSlip}
        isOpen={isShippingSlipOpen}
        onClose={() => setIsShippingSlipOpen(false)}
      />

      <ContactSellerModal
        lot={selectedLotForContact}
        isOpen={Boolean(selectedLotForContact)}
        onClose={() => setSelectedLotForContact(null)}
      />

      {/* Moroccan Mining Industry Footer - Bento Style */}
      <footer className="bg-stone-950 text-stone-400 border-t border-stone-800/80 text-xs py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-stone-100 font-extrabold text-base tracking-tight">
                  Minéra<span className="text-amber-500">Maroc</span>
                </span>
                <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full px-2.5 py-0.5 text-[10px] font-medium tracking-wider uppercase">
                  Bento Exchange
                </span>
              </div>
              <p className="text-stone-400 text-xs max-w-xl">
                Plateforme marocaine de négoce minier, reconnaissance géologique par intelligence artificielle, dépouillement de bulletins de laboratoire et cotations de la bourse des minerais en direct.
              </p>
            </div>

            <div className="flex items-center gap-4 text-stone-400">
              <span className="flex items-center gap-1.5 bg-stone-900/60 border border-stone-800 px-3 py-1.5 rounded-full text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                Cadre Réglementaire Loi n° 33-13 relative aux mines
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-800/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
            <p>
              © {new Date().getFullYear()} MinéraMaroc • Référence aux bassins de Khouribga, Bou Azzer, Zgounder, Bleida, Touissit, Zelmou et Nador.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-stone-400">Cours LME & LBMA synchronisés</span>
              <span>•</span>
              <span className="text-stone-400">Taux Bank Al-Maghrib</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <SunlightModeProvider>
      <MainApp />
    </SunlightModeProvider>
  );
}

