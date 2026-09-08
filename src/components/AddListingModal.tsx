import React, { useState, useRef } from "react";
import { MineralListing } from "../types";
import {
  X,
  PlusCircle,
  ShieldCheck,
  MapPin,
  Coins,
  Truck,
  Building2,
  Camera,
  Navigation,
  FileSpreadsheet,
  FileCheck2,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
} from "lucide-react";
import { CameraGpsCapture } from "./CameraGpsCapture";
import { GpsLocation } from "../utils/geoUtils";

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (newListing: MineralListing) => void;
  prefillData?: Partial<MineralListing>;
}

export const AddListingModal: React.FC<AddListingModalProps> = ({
  isOpen,
  onClose,
  onAddListing,
  prefillData,
}) => {
  const [title, setTitle] = useState(prefillData?.title || "");
  const [category, setCategory] = useState<MineralListing["category"]>(
    prefillData?.category || "cuivre"
  );
  const [grade, setGrade] = useState(prefillData?.grade || "");
  const [quantity, setQuantity] = useState(prefillData?.quantity || "1 000 Tonnes");
  const [quantityNumber, setQuantityNumber] = useState(prefillData?.quantityNumber || 1000);
  const [location, setLocation] = useState(prefillData?.location || "Ouarzazate");
  const [region, setRegion] = useState(prefillData?.region || "Drâa-Tafilalet");
  const [priceMAD, setPriceMAD] = useState(prefillData?.priceMAD || 25000);
  const [incoterm, setIncoterm] = useState<MineralListing["incoterm"]>(
    prefillData?.incoterm || "FOB Casablanca"
  );
  const [sellerName, setSellerName] = useState(prefillData?.sellerName || "Société Minière de l'Atlas");
  const [sellerType, setSellerType] = useState<MineralListing["sellerType"]>(
    prefillData?.sellerType || "Société Anonyme Minière"
  );
  const [hasCertifiedLabReport, setHasCertifiedLabReport] = useState(
    prefillData?.hasCertifiedLabReport ?? true
  );
  const [labName, setLabName] = useState(prefillData?.labName || "Reminex R&D / SGS Maroc");
  const [labCertificateNumber, setLabCertificateNumber] = useState(
    prefillData?.labCertificateNumber || ""
  );
  const [labBulletinUrl, setLabBulletinUrl] = useState<string | undefined>(
    prefillData?.labBulletinUrl
  );
  const [chemicalAssay, setChemicalAssay] = useState<MineralListing["chemicalAssay"]>(
    prefillData?.chemicalAssay
  );
  const [description, setDescription] = useState(
    prefillData?.description || "Lot homogène de minerai prêt à l'expédition avec certificats d'analyses complets."
  );

  // Bulletin AI upload & analysis states
  const [isAnalyzingBulletin, setIsAnalyzingBulletin] = useState(false);
  const [bulletinAnalysisMessage, setBulletinAnalysisMessage] = useState<string | null>(null);
  const [bulletinAnalysisError, setBulletinAnalysisError] = useState<string | null>(null);
  const bulletinFileInputRef = useRef<HTMLInputElement>(null);

  // Photo & GPS coordinates state
  const [imageUrl, setImageUrl] = useState<string | undefined>(prefillData?.imageUrl);
  const [coordinates, setCoordinates] = useState<GpsLocation | undefined>(
    prefillData?.coordinates
      ? {
          latitude: prefillData.coordinates.latitude,
          longitude: prefillData.coordinates.longitude,
          accuracy: prefillData.coordinates.accuracy,
          altitude: prefillData.coordinates.altitude,
          timestamp: prefillData.coordinates.timestamp,
          locationHint: prefillData.coordinates.locationHint,
        }
      : undefined
  );

  if (!isOpen) return null;

  const handleCapturePhotoAndGps = (data: {
    imageUrl: string;
    coordinates?: GpsLocation;
    detectedBasin?: string;
    detectedRegion?: string;
  }) => {
    setImageUrl(data.imageUrl);
    if (data.coordinates) {
      setCoordinates(data.coordinates);
      // Automatically suggest region/location if detected
      if (data.detectedRegion && region === "Drâa-Tafilalet" && !prefillData?.region) {
        setRegion(data.detectedRegion);
      }
      if (data.detectedBasin && location === "Ouarzazate" && !prefillData?.location) {
        setLocation(data.detectedBasin.split("(")[0].trim());
      }
    }
  };

  const handleBulletinFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setLabBulletinUrl(base64);
      setHasCertifiedLabReport(true);
      setBulletinAnalysisMessage("Bulletin importé. Cliquez sur 'Analyser par l'IA' pour extraire les teneurs officielles.");
      setBulletinAnalysisError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRunBulletinAnalysis = async () => {
    if (!labBulletinUrl) {
      setBulletinAnalysisError("Veuillez d'abord sélectionner ou déposer un fichier de bulletin d'analyse.");
      return;
    }

    setIsAnalyzingBulletin(true);
    setBulletinAnalysisError(null);
    setBulletinAnalysisMessage("Dépouillement des paramètres chimiques et vérification du laboratoire...");

    try {
      const res = await fetch("/api/analyze-technical-bulletin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentBase64: labBulletinUrl,
          mimeType: labBulletinUrl.includes("pdf") ? "application/pdf" : "image/jpeg",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.report) {
        throw new Error(data.error || "Échec de l'analyse automatique du bulletin.");
      }

      const rep = data.report;
      setHasCertifiedLabReport(true);
      if (rep.labInfo?.laboratoryName) {
        setLabName(rep.labInfo.laboratoryName);
      }
      if (rep.labInfo?.certificateNumber) {
        setLabCertificateNumber(rep.labInfo.certificateNumber);
      }
      if (rep.mainPayableElements?.[0]?.grade) {
        setGrade(rep.mainPayableElements[0].grade);
      }

      // Map mineral category if recognizable
      const ptype = (rep.primaryMineralType || "").toLowerCase();
      if (ptype.includes("cuivre") || ptype.includes("copper") || ptype.includes("chalco")) setCategory("cuivre");
      else if (ptype.includes("phosphate") || ptype.includes("p2o5")) setCategory("phosphate");
      else if (ptype.includes("argent") || ptype.includes("silver")) setCategory("argent");
      else if (ptype.includes("cobalt")) setCategory("cobalt");
      else if (ptype.includes("zinc") || ptype.includes("blende")) setCategory("zinc");
      else if (ptype.includes("plomb") || ptype.includes("galena")) setCategory("plomb");
      else if (ptype.includes("baryt") || ptype.includes("barite") || ptype.includes("baso4")) setCategory("barite");

      // Auto update chemicalAssay
      const assay = {
        primaryGrade: rep.mainPayableElements?.map((e: any) => `${e.element}: ${e.grade}`).join(", ") || grade,
        secondaryElements: rep.mainPayableElements?.slice(1).map((e: any) => `${e.element}: ${e.grade}`).join(", ") || undefined,
        impurities: rep.penaltyAndImpurities?.map((p: any) => `${p.element}: ${p.content}`).join(", ") || "Conformes aux seuils d'exportation",
        moisture: rep.physicalParameters?.moisture || "1.2%",
      };
      setChemicalAssay(assay);

      if (!title) {
        setTitle(`Lot ${rep.primaryMineralType || "Minerai"} Certifié ${rep.labInfo?.laboratoryName || "Labo Agréé"}`);
      }

      setBulletinAnalysisMessage(
        `✓ Bulletin validé : ${rep.labInfo?.laboratoryName || "Laboratoire Agréé"} (Cert. N° ${rep.labInfo?.certificateNumber || "ONHYM-MA"}) - Teneur: ${rep.mainPayableElements?.[0]?.grade || "Conforme"}`
      );
    } catch (err: any) {
      console.error(err);
      setBulletinAnalysisError(
        err.message || "Erreur lors de l'analyse automatique. Les champs restent modifiables manuellement."
      );
    } finally {
      setIsAnalyzingBulletin(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLot: MineralListing = {
      id: `LOT-MA-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      category,
      grade: grade.trim(),
      quantity: quantity.trim(),
      quantityNumber: Number(quantityNumber) || 1000,
      location: location.trim(),
      region: region.trim(),
      priceMAD: Number(priceMAD) || 1000,
      incoterm,
      sellerName: sellerName.trim(),
      sellerType,
      sellerVerified: true,
      kycNumber: `REG-MIN-${Math.floor(10000 + Math.random() * 90000)}`,
      hasCertifiedLabReport,
      labName: hasCertifiedLabReport ? labName.trim() : undefined,
      labCertificateNumber: hasCertifiedLabReport ? labCertificateNumber.trim() : undefined,
      labBulletinUrl: hasCertifiedLabReport ? labBulletinUrl : undefined,
      chemicalAssay: chemicalAssay || (hasCertifiedLabReport ? { primaryGrade: grade } : undefined),
      description: description.trim(),
      imageUrl,
      coordinates: coordinates
        ? {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            accuracy: coordinates.accuracy,
            altitude: coordinates.altitude,
            timestamp: coordinates.timestamp,
            locationHint: coordinates.locationHint,
          }
        : undefined,
      createdAt: new Date().toISOString().split("T")[0],
      contactEmail: "contact@comptoir-minier.ma",
      contactPhone: "+212 5 22 00 11 22",
    };

    onAddListing(newLot);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-stone-100">
        <div className="p-6 border-b border-stone-800 flex items-center justify-between sticky top-0 bg-stone-900/95 backdrop-blur-md z-10">
          <div>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
              Marché Minier Marocain
            </span>
            <h2 className="text-xl font-bold text-stone-100">
              Publier une Offre de Minerai ou Concentré
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* CAMERA & GPS CAPTURE FOR MINING LOT */}
          <CameraGpsCapture
            onCapture={handleCapturePhotoAndGps}
            initialImageUrl={imageUrl}
            initialCoordinates={coordinates}
            modeTitle="Prise de Vue & Géolocalisation GPS du Gisement"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-stone-300">Titre de l'annonce</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Concentré de Chalcopyrite 28% Cu, Lot de 1000T"
                className="w-full p-3 bg-stone-950 border border-stone-800 rounded-2xl text-xs font-medium text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-300">Type de Minerai</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-3 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-stone-100 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
              >
                <option value="phosphate">Phosphate</option>
                <option value="cobalt">Cobalt</option>
                <option value="argent">Argent</option>
                <option value="cuivre">Cuivre</option>
                <option value="zinc">Zinc</option>
                <option value="plomb">Plomb</option>
                <option value="barite">Barytine</option>
                <option value="or">Or</option>
                <option value="fer">Fer</option>
                <option value="manganese">Manganèse</option>
                <option value="fluorine">Fluorine (Spath Fluor)</option>
                <option value="autre">Autre minerai</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-300">Teneur / Pureté chimique</label>
              <input
                type="text"
                required
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Ex: 72% P2O5 ou 28.5% Cu ou 920 g/t Ag"
                className="w-full p-3 bg-stone-950 border border-stone-800 rounded-2xl text-xs font-medium text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-300">Quantité / Tonnage</label>
              <input
                type="text"
                required
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  const num = parseInt(e.target.value.replace(/\D/g, ""), 10);
                  if (num) setQuantityNumber(num);
                }}
                placeholder="Ex: 2 000 Tonnes"
                className="w-full p-3 bg-stone-950 border border-stone-800 rounded-2xl text-xs font-medium text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-300">Prix unitaire (MAD / Tonne)</label>
              <input
                type="number"
                required
                min="100"
                value={priceMAD}
                onChange={(e) => setPriceMAD(Number(e.target.value))}
                className="w-full p-3 bg-stone-950 border border-stone-800 rounded-2xl text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-300">Localisation / Ville minière</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Khouribga, Bou Azzer, Bleida, Nador..."
                className="w-full p-3 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-300">Région Minière du Maroc</label>
              <input
                type="text"
                required
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Ex: Drâa-Tafilalet, Béni Mellal-Khénifra..."
                className="w-full p-3 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-300">Incoterm de Livraison</label>
              <select
                value={incoterm}
                onChange={(e) => setIncoterm(e.target.value as any)}
                className="w-full p-3 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-stone-100 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
              >
                <option value="Ex-Mine">Ex-Mine (Départ carreau de la mine)</option>
                <option value="FOB Casablanca">FOB Casablanca</option>
                <option value="FOB Jorf Lasfar">FOB Jorf Lasfar</option>
                <option value="FOB Nador">FOB Nador</option>
                <option value="FOB Agadir">FOB Agadir</option>
                <option value="CFR / CIF">CFR / CIF Port International</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-300">Raison Sociale Vendeur</label>
              <input
                type="text"
                required
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                placeholder="Ex: Comptoir Minier de Zagora"
                className="w-full p-3 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
              />
            </div>
          </div>

          {/* ACCREDITED LAB BULLETIN DEPOSIT & AI ANALYSIS BENTO CARD */}
          <div className="p-5 bg-stone-950/80 rounded-3xl border border-stone-800 space-y-4 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-stone-100 text-xs uppercase tracking-wider">
                  Dépôt de Bulletin d'Analyse (Laboratoire Agréé)
                </h3>
              </div>
              <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold px-2.5 py-0.5 rounded-full w-fit">
                Certification IA Immédiate
              </span>
            </div>

            <p className="text-[11px] text-stone-400 leading-relaxed">
              Déposez le scan ou la photo de votre bulletin officiel (ex : Reminex, SGS Maroc, CADEX, ONHYM, OCP Labs, Bureau Veritas).
              L'application dépouille le document pour certifier la teneur, extraire le N° d'attestation et pré-remplir automatiquement le lot.
            </p>

            {/* Hidden file input */}
            <input
              type="file"
              ref={bulletinFileInputRef}
              onChange={handleBulletinFileSelected}
              accept="image/*,application/pdf"
              className="hidden"
            />

            {!labBulletinUrl ? (
              <div
                onClick={() => bulletinFileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-800 hover:border-amber-500/50 bg-stone-900/40 hover:bg-stone-900/80 rounded-2xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center group-hover:border-amber-500/40 transition">
                  <Upload className="w-5 h-5 text-stone-400 group-hover:text-amber-400 transition" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-stone-200 group-hover:text-amber-400 transition block">
                    Cliquer pour déposer le bulletin officiel (PDF, JPG, PNG)
                  </span>
                  <span className="text-[10px] text-stone-500">
                    Glisser-déposer ou sélectionner depuis votre appareil
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-stone-200 block truncate">
                        Document du bulletin d'analyse joint
                      </span>
                      <span className="text-[10px] text-stone-500">
                        Prêt pour le dépouillement géochimique
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => bulletinFileInputRef.current?.click()}
                      className="text-[11px] text-stone-400 hover:text-stone-200 transition underline"
                    >
                      Remplacer
                    </button>
                    <button
                      type="button"
                      disabled={isAnalyzingBulletin}
                      onClick={handleRunBulletinAnalysis}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-md disabled:opacity-50"
                    >
                      {isAnalyzingBulletin ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Dépouillement...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Analyser par l'IA</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Status or Success Notification */}
                {bulletinAnalysisMessage && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-2.5 rounded-xl text-xs flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-tight">{bulletinAnalysisMessage}</span>
                  </div>
                )}

                {bulletinAnalysisError && (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 p-2.5 rounded-xl text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{bulletinAnalysisError}</span>
                  </div>
                )}
              </div>
            )}

            {/* Checkbox and manual fields for fine-tuning */}
            <div className="pt-2 border-t border-stone-800/60 space-y-3">
              <label className="flex items-center gap-2.5 font-semibold text-stone-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCertifiedLabReport}
                  onChange={(e) => setHasCertifiedLabReport(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-700 bg-stone-900 text-amber-500 focus:ring-amber-500 focus:ring-offset-stone-950"
                />
                <span>Ce lot dispose d'un certificat d'analyse officiel (vérifié)</span>
              </label>

              {hasCertifiedLabReport && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] text-stone-400 font-medium">Nom du laboratoire agréé</label>
                    <input
                      type="text"
                      value={labName}
                      onChange={(e) => setLabName(e.target.value)}
                      placeholder="Ex: Reminex, SGS Maroc, CADEX, ONHYM..."
                      className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-stone-400 font-medium">N° de certificat d'analyse</label>
                    <input
                      type="text"
                      value={labCertificateNumber}
                      onChange={(e) => setLabCertificateNumber(e.target.value)}
                      placeholder="Ex: REM-2025-CU-0982 ou SGS-MA-8841"
                      className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-stone-300">Description détaillée du lot</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Spécifications chimiques, humidité, conditions de chargement..."
              className="w-full p-3 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
            />
          </div>

          <div className="pt-4 border-t border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition shadow-md shadow-amber-950/40 flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publier l'Offre sur MinéraMaroc</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
