import React from "react";
import { MineralListing } from "../types";
import {
  X,
  MapPin,
  Truck,
  Building2,
  FileCheck,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Coins,
  Phone,
  Mail,
  CheckCircle2,
  ExternalLink,
  Camera,
  Navigation,
  FileText,
  Scale,
} from "lucide-react";
import { formatCoordinates, getGoogleMapsUrl } from "../utils/geoUtils";

interface LotDetailsModalProps {
  lot: MineralListing | null;
  onClose: () => void;
  onContact: (lot) => void;
  usdToMadRate: number;
  onOpenShippingSlip?: (lot: MineralListing) => void;
  onSimulateLogistics?: (lot: MineralListing) => void;
  isCompared?: boolean;
  onToggleCompare?: (lotId: string) => void;
}

export const LotDetailsModal: React.FC<LotDetailsModalProps> = ({
  lot,
  onClose,
  onContact,
  usdToMadRate,
  onOpenShippingSlip,
  onSimulateLogistics,
  isCompared = false,
  onToggleCompare,
}) => {
  if (!lot) return null;

  const totalLotPriceMAD = lot.priceMAD * lot.quantityNumber;
  const totalLotPriceUSD = Math.round(totalLotPriceMAD / (usdToMadRate || 9.94));

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-stone-100">
        {/* Header */}
        <div className="p-6 border-b border-stone-800 flex items-start justify-between sticky top-0 bg-stone-900/95 backdrop-blur-md z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                {lot.category}
              </span>
              <span className="text-xs font-mono text-stone-400">Réf: {lot.id}</span>
              {lot.coordinates && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                  <Navigation className="w-3 h-3" />
                  GPS Gisement Certifié
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-100 leading-tight">
              {lot.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs sm:text-sm">
          {/* Photo of the lot / deposit if available */}
          {lot.imageUrl && (
            <div className="rounded-3xl overflow-hidden border border-stone-800 bg-stone-950 max-h-72 flex items-center justify-center relative group">
              <img
                src={lot.imageUrl}
                alt={lot.title}
                className="w-full h-full object-cover max-h-72"
              />
              <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-stone-800 text-[11px] text-amber-400 flex items-center gap-1.5 font-medium">
                <Camera className="w-3.5 h-3.5" />
                <span>Photo du lot prise sur site</span>
              </div>
            </div>
          )}

          {/* Price & Quantity summary banner */}
          <div className="bg-stone-950/80 border border-stone-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-stone-400 uppercase tracking-wider block">
                Prix Unitaire Négocié
              </span>
              <div className="text-2xl font-black font-mono text-white mt-0.5">
                {lot.priceMAD.toLocaleString("fr-FR")}{" "}
                <span className="text-xs font-sans font-normal text-amber-400">
                  MAD / Tonne
                </span>
              </div>
              <span className="text-xs text-stone-400 font-mono">
                ≈ ${(lot.priceMAD / (usdToMadRate || 9.94)).toFixed(0)} USD / t
              </span>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-stone-800 pt-3 sm:pt-0 sm:pl-6">
              <span className="text-xs text-stone-400 uppercase tracking-wider block">
                Valeur Totale du Lot ({lot.quantity})
              </span>
              <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
                {totalLotPriceMAD.toLocaleString("fr-FR")} MAD
              </div>
              <span className="text-xs text-stone-400 font-mono">
                ≈ ${totalLotPriceUSD.toLocaleString("fr-FR")} USD
              </span>
            </div>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-stone-950/70 p-3.5 rounded-2xl border border-stone-800/80">
              <span className="text-stone-500 text-xs block">Teneur certifiée</span>
              <strong className="text-amber-400 font-mono text-sm font-bold">{lot.grade}</strong>
            </div>

            <div className="bg-stone-950/70 p-3.5 rounded-2xl border border-stone-800/80">
              <span className="text-stone-500 text-xs block">Disponibilité</span>
              <strong className="text-stone-100 text-sm">{lot.quantity}</strong>
            </div>

            <div className="bg-stone-950/70 p-3.5 rounded-2xl border border-stone-800/80">
              <span className="text-stone-500 text-xs block">Incoterm</span>
              <strong className="text-stone-100 text-sm">{lot.incoterm}</strong>
            </div>

            <div className="bg-stone-950/70 p-3.5 rounded-2xl border border-stone-800/80">
              <span className="text-stone-500 text-xs block">Bassin Minier</span>
              <strong className="text-stone-100 text-sm">{lot.location}</strong>
            </div>

            <div className="bg-stone-950/70 p-3.5 rounded-2xl border border-stone-800/80">
              <span className="text-stone-500 text-xs block">Région</span>
              <strong className="text-stone-100 text-sm">{lot.region}</strong>
            </div>

            <div className="bg-stone-950/70 p-3.5 rounded-2xl border border-stone-800/80">
              <span className="text-stone-500 text-xs block">Date d'offre</span>
              <strong className="text-stone-100 text-sm">{lot.createdAt}</strong>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-stone-200 text-xs uppercase tracking-wider">
              Description & Conditions d'enlèvement
            </h3>
            <p className="text-stone-300 leading-relaxed text-xs sm:text-sm bg-stone-950/70 p-4 rounded-2xl border border-stone-800">
              {lot.description}
            </p>
          </div>

          {/* GPS Coordinates & Gisement Traceability if available */}
          {lot.coordinates && (
            <div className="space-y-2">
              <h3 className="font-bold text-stone-200 text-xs uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Navigation className="w-4 h-4" />
                  <span>Traçabilité & Coordonnées GPS du Gisement</span>
                </span>
                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                  Géolocalisation Certifiée
                </span>
              </h3>
              <div className="bg-stone-950/80 border border-emerald-500/20 rounded-2xl p-4 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-stone-400 text-[11px] block">Position GPS :</span>
                    <strong className="text-amber-400 font-mono text-xs sm:text-sm">
                      {formatCoordinates(lot.coordinates.latitude, lot.coordinates.longitude)}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[11px] block">Précision satellite :</span>
                    <strong className="text-stone-200 font-mono text-xs">
                      ±{lot.coordinates.accuracy || 5} mètres
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[11px] block">Bassin Minier Relevé :</span>
                    <strong className="text-emerald-400 text-xs truncate block">
                      {lot.coordinates.locationHint || lot.location}
                    </strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] text-stone-400">
                    {lot.coordinates.timestamp
                      ? `Relevé horodaté : ${new Date(lot.coordinates.timestamp).toLocaleString("fr-FR", { timeZone: "Africa/Casablanca" })} (Maroc)`
                      : "Relevé au moment de la prise de vue sur le carreau de la mine"}
                  </span>
                  <a
                    href={getGoogleMapsUrl(lot.coordinates.latitude, lot.coordinates.longitude)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 hover:text-amber-300 border border-stone-700 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <span>Localiser sur Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Chemical Analysis details if available */}
          {lot.chemicalAssay && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-amber-500" />
                  <span>Bulletin Chimique Certifié ({lot.labName || "Laboratoire Agréé"})</span>
                </h3>
                {lot.labCertificateNumber && (
                  <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-bold px-2 py-0.5 rounded-full">
                    Cert. N° {lot.labCertificateNumber}
                  </span>
                )}
              </div>
              <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-stone-400 block">Teneur Principale :</span>
                    <strong className="text-amber-400 text-sm font-bold">{lot.chemicalAssay.primaryGrade}</strong>
                  </div>
                  {lot.chemicalAssay.secondaryElements && (
                    <div>
                      <span className="text-stone-400 block">Éléments Secondaires :</span>
                      <strong className="text-stone-200">{lot.chemicalAssay.secondaryElements}</strong>
                    </div>
                  )}
                  {lot.chemicalAssay.moisture && (
                    <div>
                      <span className="text-stone-400 block">Humidité :</span>
                      <strong className="text-stone-200">{lot.chemicalAssay.moisture}</strong>
                    </div>
                  )}
                  {lot.chemicalAssay.impurities && (
                    <div>
                      <span className="text-stone-400 block">Impuretés contrôlées :</span>
                      <strong className="text-emerald-400">{lot.chemicalAssay.impurities}</strong>
                    </div>
                  )}
                </div>

                {lot.labBulletinUrl && (
                  <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>Copie officielle du bulletin jointe au dossier</span>
                    </span>
                    <a
                      href={lot.labBulletinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 underline flex items-center gap-1"
                    >
                      <span>Consulter le document</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Operations Bar: Bordereau, Logistique, Comparateur */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            {onOpenShippingSlip && (
              <button
                onClick={() => onOpenShippingSlip(lot)}
                className="flex items-center justify-center gap-2 bg-stone-950 hover:bg-stone-850 text-amber-400 border border-stone-800 hover:border-amber-500/50 rounded-2xl py-2.5 px-3 text-xs font-bold transition cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Bordereau Loi 33-13</span>
              </button>
            )}

            {onSimulateLogistics && (
              <button
                onClick={() => {
                  onClose();
                  onSimulateLogistics(lot);
                }}
                className="flex items-center justify-center gap-2 bg-stone-950 hover:bg-stone-850 text-blue-400 border border-stone-800 hover:border-blue-500/50 rounded-2xl py-2.5 px-3 text-xs font-bold transition cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Simuler le Fret</span>
              </button>
            )}

            {onToggleCompare && (
              <button
                onClick={() => onToggleCompare(lot.id)}
                className={`flex items-center justify-center gap-2 rounded-2xl py-2.5 px-3 text-xs font-bold border transition cursor-pointer ${
                  isCompared
                    ? "bg-amber-500/15 border-amber-500 text-amber-300"
                    : "bg-stone-950 hover:bg-stone-850 text-stone-300 border-stone-800 hover:border-stone-700"
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>{isCompared ? "Dans le Comparateur ✓" : "Ajouter au Comparateur"}</span>
              </button>
            )}
          </div>

          {/* Seller profile */}
          <div className="bg-stone-950/80 rounded-2xl p-4 border border-stone-800 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-100">{lot.sellerName}</span>
                {lot.sellerVerified && (
                  <span className="text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Vérifié ONHYM
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400">
                {lot.sellerType} • KYC: {lot.kycNumber || "Conforme"}
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onContact(lot);
              }}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2.5 rounded-2xl text-xs transition shadow-md shadow-amber-950/40 flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Demander un Devis</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
