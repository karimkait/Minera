export interface MineralListing {
  id: string;
  title: string;
  category:
    | "phosphate"
    | "argent"
    | "cobalt"
    | "cuivre"
    | "zinc"
    | "plomb"
    | "barite"
    | "or"
    | "fer"
    | "manganese"
    | "fluorine"
    | "autre";
  grade: string; // e.g. "72.4% P2O5", "15.2% Co", "920 g/t Ag", "28.5% Cu"
  quantity: string; // e.g. "5 000 Tonnes"
  quantityNumber: number; // numeric tonnes for calculations
  location: string; // e.g. "Khouribga", "Bou Azzer", "Zgounder", "Bleida"
  region: string; // Moroccan administrative/geological region
  priceMAD: number; // Price per tonne or unit in Moroccan Dirhams
  priceUSD?: number;
  incoterm: "Ex-Mine" | "FOB Casablanca" | "FOB Jorf Lasfar" | "FOB Nador" | "FOB Agadir" | "CFR / CIF";
  sellerName: string;
  sellerType: "Société Anonyme Minière" | "Coopérative Minière CADEX" | "Comptoir Agréé" | "Exploitant Particulier";
  sellerVerified: boolean;
  kycNumber?: string;
  hasCertifiedLabReport: boolean;
  labName?: string;
  labCertificateNumber?: string;
  labBulletinUrl?: string;
  description: string;
  chemicalAssay?: {
    primaryGrade: string;
    secondaryElements?: string;
    moisture?: string;
    impurities?: string;
  };
  featured?: boolean;
  imageUrl?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
    accuracy?: number; // accuracy in meters
    altitude?: number | null;
    timestamp?: string;
    locationHint?: string; // e.g. "Bassin Bou Azzer / Anti-Atlas"
  };
  createdAt: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface BourseMineralQuote {
  id: string;
  name: string;
  category: string;
  symbol: string;
  unit: string;
  benchmarkGrade: string;
  priceUSD: number;
  priceMAD: number;
  changePercent: number;
  bourseSource: string;
  marketStatus: string;
  moroccanBasins: string[];
  specifications: string;
  history7d: number[];
  historyMAD: number[];
  lastUpdated: string;
  pricePerKgUSD?: number;
  pricePerGramUSD?: number;
}

export interface BourseData {
  usdToMadRate: number;
  timestamp: string;
  indices: {
    lmeIndex: { value: number; change: number };
    ocpPhosphateIndex: { value: number; change: number };
    lbmaPreciousIndex: { value: number; change: number };
  };
  minerals: BourseMineralQuote[];
}

export interface MineralIdentificationResult {
  commonName: string;
  scientificName: string;
  chemicalFormula: string;
  mineralClass: string;
  confidenceScore: number;
  visualDescription: string;
  physicalProperties: {
    color: string;
    streak: string;
    luster: string;
    hardnessMohs: string;
    density: string;
    cleavage: string;
  };
  moroccanDeposits: Array<{
    site: string;
    region: string;
    context: string;
  }>;
  associatedMinerals: string[];
  industrialUses: string[];
  marketValuation: {
    estimatedGrade: string;
    commercialValueCategory: string;
    estimatedPriceRangeMAD: string;
    marketDemand: string;
  };
  fieldConfirmationTests: string[];
  regulatoryAdvice: string;
}

export interface TechnicalReportAnalysis {
  labInfo: {
    laboratoryName: string;
    certificateNumber: string;
    dateOfAnalysis: string;
    clientOrMine: string;
    analyticalMethod: string;
  };
  primaryMineralType: string;
  mainPayableElements: Array<{
    element: string;
    grade: string;
    benchmarkComparison: string;
  }>;
  penaltyAndImpurities: Array<{
    element: string;
    content: string;
    thresholdAllowed: string;
    penaltyRisk: string;
  }>;
  physicalParameters: {
    granulometry?: string;
    moisture?: string;
    specificGravity?: string;
  };
  commercialVerdict: {
    gradeQuality: string;
    isExportCompliant: boolean;
    valuationSummary: string;
    buyerRecommendations: string[];
    estimatedValueMADPerTonne: number;
  };
  overallComplianceRating: number;
}

export interface MoroccanDepositFactSheet {
  id: string;
  name: string;
  arabicName?: string;
  category:
    | "phosphate"
    | "cobalt"
    | "argent"
    | "cuivre"
    | "zinc"
    | "plomb"
    | "barite"
    | "or"
    | "fer"
    | "autre";
  region: string;
  province: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  primarySubstances: string[];
  secondarySubstances: string[];
  operator: string;
  geologicalEra: string;
  geologicalContext: string;
  annualProductionOrCapacity: string;
  averageCommercialGrades: string;
  strategicImportance: string;
  environmentalCompliance: string;
  historyAndDiscovery: string;
  sources: Array<{
    title: string;
    url: string;
    snippet?: string;
  }>;
  isGroundingLive?: boolean;
}

export interface BuyerRequest {
  id: string;
  title: string;
  buyerName: string;
  buyerType:
    | "Fonderie Internationale"
    | "Usine Chimique / Traitement"
    | "Trader / Négociant Export"
    | "Cimenterie"
    | "Industrie Énergétique / Forage";
  category: MineralListing["category"];
  mineralName: string;
  desiredQuantity: string;
  quantityNumber: number; // in tonnes
  minGrade: string;
  maxImpurities?: string;
  targetPriceMAD?: number;
  targetPriceUSD?: number;
  deliveryTerms: "FOB Jorf Lasfar" | "FOB Casablanca" | "FOB Nador" | "FOB Agadir" | "Rendu Usine (DDP)" | "EXW Mine";
  destinationPortOrCity: string;
  requiredCertification: string[];
  deadline: string;
  urgency: "Immédiat (< 15j)" | "Court Terme (< 30j)" | "Contrat Annuel / Régulier";
  status: "open" | "evaluating" | "fulfilled";
  contactPerson: string;
  contactEmail: string;
  contactPhone?: string;
  responsesCount: number;
  createdAt: string;
  description: string;
}

export interface ShippingSlipData {
  slipNumber: string;
  date: string;
  lotId: string;
  permitNumber: string;
  concessionName: string;
  mineralName: string;
  category: string;
  grossWeightTonnes: number;
  tareWeightTonnes: number;
  netWeightTonnes: number;
  declaredMoisturePercent: number;
  dryNetWeightTonnes: number;
  certifiedGrade: string;
  labCertificateRef: string;
  labName: string;
  loadingSite: string;
  destinationPortOrPlant: string;
  incoterm: string;
  carrierCompany: string;
  truckPlateNumbers: string[];
  driverName?: string;
  driverLicenseNumber?: string;
  sealNumbers: string[];
  cadexNumber?: string;
  originDeclaration: string;
  inspectorOfficer?: string;
}

export interface LogisticsRouteSimulation {
  originBasin: string;
  destinationPort: string;
  distanceKm: number;
  tonnage: number;
  truckCapacityTonnes: number;
  requiredTrucks: number;
  ratePerTonneKm: number;
  transportCostTotalMAD: number;
  transportCostPerTonneMAD: number;
  weighbridgeFeeMAD: number;
  portHandlingAndStevedoringMAD: number;
  customsDocumentationMAD: number;
  totalLogisticsMAD: number;
  totalLogisticsPerTonneMAD: number;
  baseExwPriceMADPerTonne: number;
  recommendedFobPriceMADPerTonne: number;
  recommendedFobPriceUSDPerTonne: number;
}
