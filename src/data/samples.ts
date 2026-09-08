export interface MineralSamplePreset {
  id: string;
  name: string;
  deposit: string;
  region: string;
  description: string;
  notes: string;
  badge: string;
  colorHex: string;
  // A clean SVG data URI representation of the mineral sample rock for instant testing
  previewSvg: string;
}

export interface LabBulletinPreset {
  id: string;
  title: string;
  labName: string;
  mineralName: string;
  referenceDoc: string;
  date: string;
  rawText: string;
}

export const ROCK_SAMPLE_PRESETS: MineralSamplePreset[] = [
  {
    id: "sample-cobalt-bouazzer",
    name: "Érythrite & Cobaltite (Fleur de Cobalt)",
    deposit: "Bou Azzer, Anti-Atlas Central",
    region: "Drâa-Tafilalet",
    badge: "Cobalt Marocain",
    colorHex: "#e11d48",
    description: "Cristaux aciculaires rose carmin éclatant à pourpre associés à des grains métalliques de cobaltite gris argenté dans une gangue de quartz et calcite.",
    notes: "Échantillon récolté au niveau -250m de la mine de Bou Azzer. Éclat vitreux à adamantin, couleur carmin très vive, trace rose pâle. Densité estimée > 3.1.",
    previewSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e293b"/><stop offset="50%" stop-color="%23334155"/><stop offset="100%" stop-color="%230f172a"/></linearGradient><linearGradient id="cobalt" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23f43f5e"/><stop offset="50%" stop-color="%23e11d48"/><stop offset="100%" stop-color="%239f1239"/></linearGradient></defs><rect width="400" height="300" fill="url(%23g1)"/><polygon points="80,180 150,70 290,90 340,210 240,260 110,240" fill="%23475569" stroke="%2364748b" stroke-width="4"/><polygon points="120,150 170,100 250,115 280,190 200,220" fill="url(%23cobalt)"/><circle cx="160" cy="130" r="14" fill="%23fb7185"/><circle cx="220" cy="160" r="20" fill="%23fda4af" opacity="0.8"/><text x="200" y="275" fill="%23f8fafc" font-size="14" font-family="sans-serif" text-anchor="middle">Bou Azzer • Erythrite (Fleur de Cobalt)</text></svg>`,
  },
  {
    id: "sample-malachite-bleida",
    name: "Malachite & Azurite Botryoïdale",
    deposit: "Bleida, Zagora",
    region: "Drâa-Tafilalet",
    badge: "Cuivre Marocain",
    colorHex: "#059669",
    description: "Agrégats mamelonnés vert émeraude rubané avec encroûtements bleus d'azurite sur roche encaissante quartzite et chalcopyrite disséminée.",
    notes: "Zone d'oxydation du gisement cuprifère de Bleida. Effervescence vive à l'acide chlorhydrique dilué HCl (carbonate de cuivre). Dureté estimée à 3.5 - 4.",
    previewSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2318181b"/><stop offset="100%" stop-color="%2327272a"/></linearGradient><linearGradient id="mal" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2310b981"/><stop offset="50%" stop-color="%23047857"/><stop offset="100%" stop-color="%23064e3b"/></linearGradient></defs><rect width="400" height="300" fill="url(%23bg)"/><polygon points="70,160 140,80 300,75 350,190 280,250 100,230" fill="%233f3f46" stroke="%2352525b" stroke-width="4"/><circle cx="170" cy="140" r="45" fill="url(%23mal)" stroke="%2334d399" stroke-width="5"/><circle cx="240" cy="160" r="35" fill="url(%23mal)" stroke="%2334d399" stroke-width="4"/><circle cx="210" cy="115" r="22" fill="%232563eb"/><text x="200" y="275" fill="%23f8fafc" font-size="14" font-family="sans-serif" text-anchor="middle">Bleida • Malachite & Azurite (Cuivre)</text></svg>`,
  },
  {
    id: "sample-phosphate-khouribga",
    name: "Phosphate Rocheux Sédimentaire Oolithique",
    deposit: "Khouribga, Bassin d'Ouled Abdoun",
    region: "Béni Mellal-Khénifra",
    badge: "Phosphate OCP",
    colorHex: "#b45309",
    description: "Roche sédimentaire phosphatée beige-brunâtre granuleuse constituée de grains arrondis d'apatite-francolite avec petits débris osseux et dents de requin fossiles.",
    notes: "Couche 1 du bassin d'Ouled Abdoun. Roche dense et friable, odeur bitumineuse faible à la cassure fraîche. Teneur visuelle estimée > 70% BPL.",
    previewSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><linearGradient id="phos" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23f59e0b"/><stop offset="50%" stop-color="%23d97706"/><stop offset="100%" stop-color="%2378350f"/></linearGradient></defs><rect width="400" height="300" fill="%231c1917"/><polygon points="90,170 160,85 290,95 330,195 245,250 115,225" fill="url(%23phos)" stroke="%23fbbf24" stroke-width="3"/><circle cx="150" cy="150" r="6" fill="%23fef3c7"/><circle cx="180" cy="130" r="8" fill="%23fde68a"/><circle cx="220" cy="170" r="10" fill="%23fde68a"/><circle cx="260" cy="140" r="7" fill="%23fef3c7"/><text x="200" y="275" fill="%23f8fafc" font-size="14" font-family="sans-serif" text-anchor="middle">Khouribga • Phosphate Rocheux 72% BPL</text></svg>`,
  },
  {
    id: "sample-barytine-nador",
    name: "Barytine Tabulaire Crêtée Haute Densité",
    deposit: "Nador / Zelmou",
    region: "Oriental",
    badge: "Barytine API",
    colorHex: "#0284c7",
    description: "Agrégats de cristaux tabulaires blancs translucides disposés en crêtes (fleurs de baryte). Remarquablement lourde en main (densité très forte).",
    notes: "Filon hydrothermal de Zelmou. Densité mesurée à 4.3 g/cm³. Pas d'effervescence à l'acide. Éclat vitreux à nacré sur les faces de clivage.",
    previewSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><linearGradient id="bar" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23f8fafc"/><stop offset="50%" stop-color="%23e2e8f0"/><stop offset="100%" stop-color="%2394a3b8"/></linearGradient></defs><rect width="400" height="300" fill="%230f172a"/><polygon points="80,180 140,90 270,80 340,170 280,240 120,235" fill="%23334155" stroke="%23475569" stroke-width="3"/><polygon points="130,160 160,110 240,105 270,155 210,195" fill="url(%23bar)" stroke="%23cbd5e1" stroke-width="3"/><polygon points="170,180 200,120 270,130 250,185" fill="%23ffffff" opacity="0.9"/><text x="200" y="275" fill="%23f8fafc" font-size="14" font-family="sans-serif" text-anchor="middle">Zelmou • Barytine Crêtée (Densité 4.3)</text></svg>`,
  },
  {
    id: "sample-galene-mibladen",
    name: "Galène Argentifère Cristallisée",
    deposit: "Mibladen / Midelt",
    region: "Drâa-Tafilalet",
    badge: "Plomb & Argent",
    colorHex: "#475569",
    description: "Cristaux cubiques parfaits à éclat métallique gris acier très brillant, parfois associés à de la cérusite ou de la vanadinite rouge.",
    notes: "District de Mibladen. Clivage cubique parfait selon trois plans orthogonaux. Dureté 2.5 (se raye à la pièce de monnaie), très haute densité (7.5 g/cm³).",
    previewSvg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><linearGradient id="gal" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23e2e8f0"/><stop offset="50%" stop-color="%2364748b"/><stop offset="100%" stop-color="%231e293b"/></linearGradient></defs><rect width="400" height="300" fill="%2309090b"/><polygon points="100,140 180,90 270,105 320,180 230,230 115,200" fill="%2327272a" stroke="%2352525b" stroke-width="3"/><rect x="150" y="120" width="70" height="70" fill="url(%23gal)" stroke="%23f8fafc" stroke-width="3" transform="rotate(15 185 155)"/><text x="200" y="275" fill="%23f8fafc" font-size="14" font-family="sans-serif" text-anchor="middle">Mibladen • Galène Argentifère (Pb-Ag)</text></svg>`,
  },
];

export const LAB_BULLETIN_PRESETS: LabBulletinPreset[] = [
  {
    id: "bulletin-reminex-cobalt",
    title: "Bulletin Reminex R&D - Concentré de Cobalt Bou Azzer",
    labName: "Reminex Ingénierie & Laboratoire (Groupe Managem)",
    mineralName: "Concentré de Cobalt et Nickel",
    referenceDoc: "CERT-RMX-2026-CO-8821",
    date: "28 Août 2026",
    rawText: `================================================================================
REMINEX R&D - CENTRE DE RECHERCHE ET ANALYSES MINIÈRES
Casablanca, Maroc - Accréditation NM ISO/IEC 17025
CERTIFICAT D'ANALYSE CHIMIQUE ET MINÉRALOGIQUE
Réf. Dossier: REM-2026-LOT-CO-8821 | Date d'analyse: 28/08/2026
Client: Consortium Atlas Cobalt Mines | Origine: Filon 7/5, Bou Azzer (Maroc)
Nature de l'échantillon: Concentré enrichi de flottation sélective (Lot de 250 T)
Méthodes: Spectrométrie d'Émission Plasma (ICP-OES) + Absorption Atomique (AAS)
--------------------------------------------------------------------------------
1. ÉLÉMENTS PRINCIPAUX VALORISABLES :
   - Cobalt (Co) : 14.85 % m/m  (Standard marchant international: 8 à 12%)
   - Nickel (Ni) : 1.22 % m/m
   - Cuivre (Cu) : 0.68 % m/m
   - Argent (Ag) : 48.5 g/t (ppm)

2. IMPURETÉS ET ÉLÉMENTS PÉNALISANTS :
   - Arsenic total (As) : 41.60 % (lié en arséniures stables cobaltite/skuttérudite)
   - Bismuth (Bi) : 0.07 % m/m  [Tolérance fonderie: < 0.15%] -> CONFORME
   - Plomb (Pb) : 0.04 % m/m    [Tolérance fonderie: < 0.10%] -> CONFORME
   - Fer total (Fe) : 4.65 % m/m
   - Silice insoluble (SiO2) : 3.80 % m/m

3. PARAMÈTRES PHYSIQUES :
   - Humidité résiduelle (105°C) : 1.45 %
   - Granulométrie : 85 % passant à 75 µm (maille 200 mesh)
   - Densité apparente : 3.42 g/cm³

CONCLUSION & AVIS TECHNIQUE :
Le lot présente une teneur exceptionnelle en Cobalt (14.85%), largement supérieure
aux exigences des raffineries européennes et asiatiques de précurseurs de batteries.
Absence de pénalité sur le Bismuth et le Plomb. Échantillon conforme pour expédition FOB.
================================================================================`,
  },
  {
    id: "bulletin-ocp-phosphate",
    title: "Certificat OCP / SGS - Phosphate Rocheux Khouribga",
    labName: "SGS Maroc & Laboratoire Central OCP Khouribga",
    mineralName: "Phosphate Sédimentaire d'Ouled Abdoun",
    referenceDoc: "SGS-CAS-MIN-94112",
    date: "02 Septembre 2026",
    rawText: `================================================================================
SGS MAROC S.A. - DIVISION MINERAUX ET FERTILISANTS
Boulevard des Almohades, Casablanca, MAROC
BULLETIN D'ESSAI ET DE CONFORMITÉ MARCHANDE
N° Certificat: SGS-CAS-MIN-94112 | Date de prélèvement: 01/09/2026
Site d'extraction: Mine de Sidi Chennane, Khouribga
Marchandise: Phosphate brut lavé et séché - Lot n° KHR-2026-15KT
--------------------------------------------------------------------------------
1. COMPOSITION CHIMIQUE PRINCIPALE :
   - P2O5 (Anhydride phosphorique) : 33.15 %  (Équivalent BPL : 72.42 %)
   - CaO (Oxyde de calcium) : 51.30 %
   - Ratio CaO / P2O5 : 1.547  (Excellent rendement d'attaque sulfurique)
   - CO2 (Carbonates) : 4.85 %
   - SiO2 (Silice) : 2.75 %
   - Fe2O3 (Oxyde de fer) : 0.32 %  (Très faible, pas d'émulsion)
   - Al2O3 (Alumine) : 0.44 %
   - MgO (Oxyde de magnésium) : 0.38 %

2. ÉLÉMENTS TRACES ET NORMES ENVIRONNEMENTALES EU :
   - Cadmium (Cd) : 11.8 mg/kg P2O5  [Limite réglementation UE: 60 mg/kg] -> EXCELLENT
   - Arsenic (As) : 4.2 mg/kg
   - Uranium (U) : 85 ppm
   - Métaux lourds totaux : Strictement conformes aux standards européens

3. CARACTÉRISTIQUES PHYSIQUES :
   - Humidité libre à l'embarquement : 1.95 %
   - Granulométrie : 0 - 2 mm (98% passant)

VERDICT COMMERCIAL :
Qualité marchande Premium. Teneur BPL 72.42% très recherchée pour la synthèse
d'acide phosphorique purifié (PPA) et engrais hydrosolubles.
================================================================================`,
  },
  {
    id: "bulletin-als-argent",
    title: "Rapport d'Essai ALS Minerals - Concentré d'Argent Zgounder",
    labName: "ALS Minerals Laboratories Morocco",
    mineralName: "Concentré d'Argent et Métaux Précieux",
    referenceDoc: "ALS-MA-ZG-3310-FA",
    date: "30 Août 2026",
    rawText: `================================================================================
ALS MINERALS LABORATORIES - MAROC
Avenue Hassan II, Agadir, Maroc
CERTIFICATE OF ANALYSIS - FIRE ASSAY & MULTI-ELEMENT ICP
Rapport d'essai n°: ALS-MA-ZG-3310-FA | Date: 30/08/2026
Projet: Zgounder Silver Expansion | Lot référence: ZG-FLOT-600T
Type d'échantillon: Pulpe concentrée séchée sous vide
--------------------------------------------------------------------------------
MÉTHODE ANALYTIQUE : Coupellation Pyrochimique (Fire Assay Gravimetric) + ICP-AES
1. TENEURS VALORISABLES :
   - Argent (Ag) par pyro-analyse : 920.4 g/t  (0.092 % Ag métal fin)
   - Or (Au) crédit valorisable : 0.48 g/t
   - Cuivre (Cu) : 0.85 % m/m
   - Plomb (Pb) : 1.15 % m/m

2. ÉLÉMENTS DÉLÉTÈRES ET PÉNALITÉS :
   - Antimoine (Sb) : 0.038 %  [Seuil de pénalité : 0.10%] -> Aucune pénalité
   - Mercure (Hg) : 6 ppm      [Seuil de pénalité : 50 ppm] -> Conforme
   - Arsenic (As) : 0.14 %
   - Humidité : 6.4 % après filtre-presse

OBSERVATIONS COMMERCIALES :
Concentré de très haute teneur en argent natif et acanthite. Taux de récupération
estimé en fonderie > 96.5%. Valeur nette marchande estimée très favorable.
================================================================================`,
  },
];
