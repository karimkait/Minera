import React, { useState } from "react";
import { MineralListing, ShippingSlipData } from "../types";
import {
  X,
  Printer,
  FileCheck,
  ShieldCheck,
  Truck,
  Building2,
  Calendar,
  Download,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Stamp,
} from "lucide-react";

interface ShippingSlipModalProps {
  lot: MineralListing | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShippingSlipModal: React.FC<ShippingSlipModalProps> = ({
  lot,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !lot) return null;

  // Derive initial values from lot
  const defaultSlipNumber = `BORD-${new Date().getFullYear()}-${lot.id.replace("lot-", "").padStart(4, "0")}`;
  const defaultPermitNumber = lot.kycNumber || `PE-MAROC-${Math.floor(1000 + Math.random() * 9000)}`;
  const defaultMoisture = lot.chemicalAssay?.moisture ? parseFloat(lot.chemicalAssay.moisture) || 3.5 : 3.5;
  const netWeight = lot.quantityNumber || 100;
  const dryWeight = Math.round(netWeight * (1 - defaultMoisture / 100) * 10) / 10;

  const [slipData, setSlipData] = useState<ShippingSlipData>({
    slipNumber: defaultSlipNumber,
    date: new Date().toISOString().split("T")[0],
    lotId: lot.id,
    permitNumber: defaultPermitNumber,
    concessionName: `Mine de ${lot.location} - Concession ${lot.region}`,
    mineralName: lot.title,
    category: lot.category,
    grossWeightTonnes: Math.round((netWeight + 28.5) * 10) / 10,
    tareWeightTonnes: 28.5,
    netWeightTonnes: netWeight,
    declaredMoisturePercent: defaultMoisture,
    dryNetWeightTonnes: dryWeight,
    certifiedGrade: lot.grade,
    labCertificateRef: lot.labCertificateNumber || "CERT-ONHYM-2026-B88",
    labName: lot.labName || "Reminex / SGS Maroc",
    loadingSite: `Carreau de Mine - ${lot.location} (${lot.region})`,
    destinationPortOrPlant: lot.incoterm.includes("FOB")
      ? lot.incoterm.replace("FOB ", "Port Minéralier de ")
      : "Port de Jorf Lasfar / Usine Guemassa",
    incoterm: lot.incoterm,
    carrierCompany: "Trans-Minéraux Express S.A.R.L (Agrément Transport Minier n° 441)",
    truckPlateNumbers: ["28-A-94112", "14-B-77230", "06-H-19044"],
    driverName: "Hassan El-Idrissi & Équipe",
    driverLicenseNumber: "PERMIS-EC-883921",
    sealNumbers: ["SCELLÉ-DOUANE-004812", "SCELLÉ-MINE-004813"],
    cadexNumber: "CADEX-TAFILALET-9921",
    originDeclaration: "Extraction 100% origine Royaume du Maroc - Conforme Loi 33-13 relative aux mines",
    inspectorOfficer: "Ingénieur en Chef des Mines - Arrondissement Régional",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const textContent = `===============================================================
ROYAUME DU MAROC
MINISTÈRE DE LA TRANSITION ÉNERGÉTIQUE ET DU DÉVELOPPEMENT DURABLE
DIRECTION DE LA GÉOLOGIE ET DES MINES
---------------------------------------------------------------
BORDEREAU D'EXPÉDITION ET DE TRAÇABILITÉ MINÉRALE
Conforme aux dispositions de la Loi n° 33-13 relative aux mines
---------------------------------------------------------------
N° BORDEREAU : ${slipData.slipNumber}
DATE DE DÉPART : ${slipData.date}
RÉFÉRENCE LOT : ${slipData.lotId}
TITRE MINIER / PERMIS : ${slipData.permitNumber}
CONCESSION / SITE : ${slipData.concessionName}

SUBSTANCE MINÉRALE : ${slipData.mineralName}
TENEUR UTILE CERTIFIÉE : ${slipData.certifiedGrade}
LABORATOIRE AGRÉÉ : ${slipData.labName} (Réf: ${slipData.labCertificateRef})

POIDS BRUT : ${slipData.grossWeightTonnes} Tonnes
TARE VÉHICULES : ${slipData.tareWeightTonnes} Tonnes
POIDS NET HUMIDE : ${slipData.netWeightTonnes} Tonnes
HUMIDITÉ DÉCLARÉE : ${slipData.declaredMoisturePercent} %
POIDS NET SEC FACTURABLE : ${slipData.dryNetWeightTonnes} Tonnes

ORIGINE : ${slipData.loadingSite}
DESTINATION : ${slipData.destinationPortOrPlant}
INCOTERM : ${slipData.incoterm}

TRANSPORTEUR AGRÉÉ : ${slipData.carrierCompany}
CHAUFFEUR PRINCIPAL : ${slipData.driverName} (Permis: ${slipData.driverLicenseNumber})
IMMATRICULATIONS CAMIONS : ${slipData.truckPlateNumbers.join(", ")}
NUMÉROS DES SCELLÉS : ${slipData.sealNumbers.join(", ")}

DÉCLARATION D'ORIGINE : ${slipData.originDeclaration}
VISA INSPECTEUR : ${slipData.inspectorOfficer}
===============================================================`;

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Bordereau_${slipData.slipNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl text-stone-100 print:bg-white print:text-black print:border-none print:shadow-none print:max-h-none print:w-full print:rounded-none">
        {/* Actions header (hidden on print) */}
        <div className="p-4 sm:p-6 border-b border-stone-800 flex items-center justify-between sticky top-0 bg-stone-900/95 backdrop-blur-md z-10 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-stone-100 leading-tight">
                Bordereau d'Expédition Minéralier
              </h2>
              <p className="text-xs text-stone-400">
                Fiche officielle de traçabilité conforme Loi n° 33-13
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 rounded-xl border border-stone-700 hover:bg-stone-800 text-xs font-semibold text-stone-300 transition cursor-pointer"
            >
              {isEditing ? "Mode Vue" : "Modifier Détails"}
            </button>
            <button
              onClick={handleDownloadText}
              className="p-2 rounded-xl border border-stone-700 hover:bg-stone-800 text-stone-300 transition cursor-pointer hidden sm:flex"
              title="Télécharger version texte"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3.5 py-1.5 rounded-xl text-xs transition shadow-md shadow-amber-950/40 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm bg-white text-stone-900 print:p-0 print:m-0 print:text-black">
          {/* Official Royal Header */}
          <div className="border-b-2 border-stone-800 pb-4 text-center space-y-1 relative">
            <div className="flex items-center justify-between text-[11px] font-mono text-stone-600 mb-1">
              <span>ROYAUME DU MAROC</span>
              <span className="font-bold text-amber-700 print:text-black">Loi Minière n° 33-13</span>
              <span>المملكة المغربية</span>
            </div>
            <div className="font-bold text-xs uppercase tracking-wider text-stone-800">
              Ministère de la Transition Énergétique et du Développement Durable
            </div>
            <div className="text-[11px] text-stone-600 font-semibold">
              Direction Générale de la Géologie et des Mines • Registre Cadastral Minier
            </div>
            <h1 className="text-base sm:text-xl font-black uppercase tracking-wide text-stone-950 pt-2">
              Bordereau Officiel d'Expédition & de Transport de Minerais
            </h1>
            <div className="flex items-center justify-center gap-4 text-xs font-mono pt-1 text-stone-700">
              <span>N° Bordereau: <strong className="text-black font-bold">{slipData.slipNumber}</strong></span>
              <span>•</span>
              <span>Date: <strong>{slipData.date}</strong></span>
              <span>•</span>
              <span>Réf Lot: <strong>{slipData.lotId}</strong></span>
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-950 print:border-stone-400 print:bg-stone-50">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 print:text-black" />
            <p className="leading-relaxed">
              Ce document doit obligatoirement accompagner chaque convoi ou conteneur depuis le carreau de la mine jusqu'au port d'embarquement ou usine de traitement au Maroc. Il certifie la régularité du titre minier et les données d'analyse contradictoire.
            </p>
          </div>

          {/* Section 1: Titre Minier & Vendeur */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-stone-300 rounded-xl p-4 bg-stone-50/70 print:bg-white print:border-stone-400">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                1. Concession & Exploitant Légal
              </span>
              <div className="text-xs">
                <span className="text-stone-500">Exploitant déclaré :</span>{" "}
                <strong className="text-stone-900">{lot.sellerName}</strong>
              </div>
              <div className="text-xs">
                <span className="text-stone-500">Statut juridique :</span>{" "}
                <strong className="text-stone-800">{lot.sellerType}</strong>
              </div>
              <div className="text-xs">
                <span className="text-stone-500">Titre Minier / Permis :</span>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={slipData.permitNumber}
                    onChange={(e) => setSlipData({ ...slipData, permitNumber: e.target.value })}
                    className="border border-stone-400 px-2 py-0.5 rounded text-xs w-full mt-1"
                  />
                ) : (
                  <strong className="font-mono text-amber-800 print:text-black">{slipData.permitNumber}</strong>
                )}
              </div>
              <div className="text-xs">
                <span className="text-stone-500">Nom du gisement :</span>{" "}
                <span className="font-medium text-stone-900">{slipData.concessionName}</span>
              </div>
            </div>

            <div className="space-y-1.5 sm:border-l sm:border-stone-300 sm:pl-4">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                2. Lieu de Chargement & Destination
              </span>
              <div className="text-xs">
                <span className="text-stone-500">Site d'extraction / Carreau :</span>{" "}
                <strong className="text-stone-900">{slipData.loadingSite}</strong>
              </div>
              <div className="text-xs">
                <span className="text-stone-500">Destination finale :</span>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={slipData.destinationPortOrPlant}
                    onChange={(e) => setSlipData({ ...slipData, destinationPortOrPlant: e.target.value })}
                    className="border border-stone-400 px-2 py-0.5 rounded text-xs w-full mt-1"
                  />
                ) : (
                  <strong className="text-stone-900">{slipData.destinationPortOrPlant}</strong>
                )}
              </div>
              <div className="text-xs">
                <span className="text-stone-500">Incoterm applicable :</span>{" "}
                <span className="font-bold text-stone-800 bg-stone-200 px-2 py-0.5 rounded text-[11px]">
                  {slipData.incoterm}
                </span>
              </div>
              {lot.coordinates && (
                <div className="text-[11px] text-stone-600 font-mono">
                  GPS Carreau : {lot.coordinates.latitude.toFixed(4)}°N, {lot.coordinates.longitude.toFixed(4)}°W
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Poids et Pesée Officielle */}
          <div className="border border-stone-300 rounded-xl overflow-hidden print:border-stone-400">
            <div className="bg-stone-200 px-4 py-2 text-xs font-bold text-stone-800 uppercase tracking-wide flex items-center justify-between">
              <span>3. Relevé de Pesage & Humidité (Pont-Bascule Homologué)</span>
              <span className="font-mono text-[10px] text-stone-600">Norme NM ISO 13909</span>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 uppercase block font-semibold">Poids Brut Total</span>
                <span className="text-base font-mono font-bold text-stone-950">
                  {slipData.grossWeightTonnes} t
                </span>
              </div>
              <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 uppercase block font-semibold">Tare Véhicules</span>
                <span className="text-base font-mono font-bold text-stone-950">
                  {slipData.tareWeightTonnes} t
                </span>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                <span className="text-[10px] text-amber-900 uppercase block font-semibold">Poids Net Humide</span>
                <span className="text-base font-mono font-bold text-amber-950">
                  {slipData.netWeightTonnes} t
                </span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-emerald-900 uppercase block font-semibold">Poids Net Sec ({100 - slipData.declaredMoisturePercent}%)</span>
                <span className="text-base font-mono font-black text-emerald-950">
                  {slipData.dryNetWeightTonnes} t
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Spécifications Chimiques & Laboratoire */}
          <div className="border border-stone-300 rounded-xl p-4 space-y-2 print:border-stone-400">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              4. Données Qualitatives & Visa du Laboratoire Accrédité
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-stone-500 block">Substance Minérale :</span>
                <strong className="text-stone-900">{slipData.mineralName}</strong>
              </div>
              <div>
                <span className="text-stone-500 block">Teneur Payable Certifiée :</span>
                <strong className="text-amber-800 font-mono text-sm print:text-black">
                  {slipData.certifiedGrade}
                </strong>
              </div>
              <div>
                <span className="text-stone-500 block">Certificat d'Analyse Réf :</span>
                <strong className="text-stone-900 font-mono">{slipData.labCertificateRef}</strong>
                <span className="text-[11px] text-stone-500 block">Délivré par : {slipData.labName}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Convoi & Sécurité du Transport */}
          <div className="border border-stone-300 rounded-xl p-4 space-y-2 bg-stone-50/50 print:border-stone-400 print:bg-white">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              5. Logistique, Immatriculations & Scellés Inviolables
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-stone-500">Transporteur Agréé :</div>
                <strong className="text-stone-900">{slipData.carrierCompany}</strong>
                <div className="text-stone-500 mt-1">Chauffeur responsable :</div>
                <strong className="text-stone-800">{slipData.driverName}</strong>
              </div>
              <div>
                <div className="text-stone-500">Plaques d'Immatriculation Camions :</div>
                <div className="font-mono text-stone-900 font-bold">
                  {slipData.truckPlateNumbers.join(" • ")}
                </div>
                <div className="text-stone-500 mt-1">Numéros des Scellés de Sécurité :</div>
                <div className="font-mono text-stone-800 font-semibold">
                  {slipData.sealNumbers.join(" • ")}
                </div>
              </div>
            </div>
          </div>

          {/* Signatures and Stamps Section */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-300 text-center text-[11px]">
            <div className="border border-stone-200 rounded-lg p-3 min-h-[90px] flex flex-col justify-between">
              <span className="font-bold text-stone-700">Visa de l'Exploitant Minier</span>
              <span className="text-[10px] text-stone-400 italic">Signature & Cachet</span>
            </div>
            <div className="border border-stone-200 rounded-lg p-3 min-h-[90px] flex flex-col justify-between">
              <span className="font-bold text-stone-700">Visa du Transporteur / Chauffeur</span>
              <span className="text-[10px] text-stone-400 italic">Prise en charge du convoi</span>
            </div>
            <div className="border border-stone-200 rounded-lg p-3 min-h-[90px] flex flex-col justify-between bg-stone-50">
              <span className="font-bold text-stone-800">Visa Douane / Contrôle Minier</span>
              <span className="text-[10px] text-stone-500 italic">Pont-bascule d'entrée portuaire</span>
            </div>
          </div>

          <div className="text-[10px] text-stone-500 text-center pt-2 font-mono">
            Document généré via la plateforme MinéraMaroc • Système de traçabilité conforme au Dahir n° 1-15-76 portant promulgation de la Loi n° 33-13.
          </div>
        </div>
      </div>
    </div>
  );
};
