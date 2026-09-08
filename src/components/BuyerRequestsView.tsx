import React, { useState } from "react";
import { BuyerRequest, MineralListing } from "../types";
import {
  Briefcase,
  Search,
  Plus,
  Filter,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Building2,
  Coins,
  CheckCircle2,
  FileCheck,
  Send,
  X,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface BuyerRequestsViewProps {
  buyerRequests: BuyerRequest[];
  onAddBuyerRequest: (newReq: BuyerRequest) => void;
  listings: MineralListing[];
  usdToMadRate: number;
  onToast: (msg: string) => void;
}

export const BuyerRequestsView: React.FC<BuyerRequestsViewProps> = ({
  buyerRequests,
  onAddBuyerRequest,
  listings,
  usdToMadRate,
  onToast,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedUrgency, setSelectedUrgency] = useState<string>("all");

  // Modal for new tender
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Modal for responding to a tender
  const [respondingTender, setRespondingTender] = useState<BuyerRequest | null>(null);
  const [selectedLotToOffer, setSelectedLotToOffer] = useState<string>("");
  const [offeredPriceMAD, setOfferedPriceMAD] = useState<number>(0);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [responseContact, setResponseContact] = useState<string>("");

  // Filtered requests
  const filteredRequests = buyerRequests.filter((req) => {
    if (selectedCategory !== "all" && req.category !== selectedCategory) return false;
    if (selectedUrgency !== "all" && req.urgency !== selectedUrgency) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        req.title.toLowerCase().includes(q) ||
        req.buyerName.toLowerCase().includes(q) ||
        req.mineralName.toLowerCase().includes(q) ||
        req.destinationPortOrCity.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenRespondModal = (tender: BuyerRequest) => {
    setRespondingTender(tender);
    setOfferedPriceMAD(tender.targetPriceMAD || 5000);
    setResponseMessage(`Bonjour, nous disposons d'un lot conforme à vos spécifications (${tender.minGrade}) prêt pour expédition.`);
    setResponseContact("");
    setSelectedLotToOffer("");
  };

  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!respondingTender) return;
    onToast(`Votre proposition d'offre pour « ${respondingTender.title} » a été transmise à l'acheteur.`);
    setRespondingTender(null);
  };

  // State for new tender form
  const [newTitle, setNewTitle] = useState("");
  const [newBuyerName, setNewBuyerName] = useState("");
  const [newBuyerType, setNewBuyerType] = useState<BuyerRequest["buyerType"]>("Trader / Négociant Export");
  const [newCategory, setNewCategory] = useState<BuyerRequest["category"]>("cuivre");
  const [newMineralName, setNewMineralName] = useState("");
  const [newQuantity, setNewQuantity] = useState("1 000 Tonnes");
  const [newQuantityNumber, setNewQuantityNumber] = useState(1000);
  const [newMinGrade, setNewMinGrade] = useState("Teneur marchande standard");
  const [newDeliveryTerms, setNewDeliveryTerms] = useState<BuyerRequest["deliveryTerms"]>("FOB Casablanca");
  const [newDestination, setNewDestination] = useState("Port de Casablanca");
  const [newTargetPriceMAD, setNewTargetPriceMAD] = useState(15000);
  const [newDeadline, setNewDeadline] = useState("2026-10-31");
  const [newUrgency, setNewUrgency] = useState<BuyerRequest["urgency"]>("Court Terme (< 30j)");
  const [newContactPerson, setNewContactPerson] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleCreateTenderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBuyerName.trim() || !newContactEmail.trim()) {
      onToast("Veuillez renseigner les champs obligatoires (Titre, Acheteur, Email).");
      return;
    }

    const created: BuyerRequest = {
      id: `RFQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle,
      buyerName: newBuyerName,
      buyerType: newBuyerType,
      category: newCategory,
      mineralName: newMineralName || newTitle,
      desiredQuantity: newQuantity,
      quantityNumber: newQuantityNumber,
      minGrade: newMinGrade,
      targetPriceMAD: newTargetPriceMAD,
      targetPriceUSD: Math.round(newTargetPriceMAD / (usdToMadRate || 9.94)),
      deliveryTerms: newDeliveryTerms,
      destinationPortOrCity: newDestination,
      requiredCertification: ["Certificat d'Origine Maroc", "Bulletin Laboratoire Agréé"],
      deadline: newDeadline,
      urgency: newUrgency,
      status: "open",
      contactPerson: newContactPerson || newBuyerName,
      contactEmail: newContactEmail,
      responsesCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      description: newDescription || "Demande d'approvisionnement officiel via MinéraMaroc.",
    };

    onAddBuyerRequest(created);
    setIsCreateModalOpen(false);
    onToast(`Appel d'offres ${created.id} publié avec succès sur la bourse.`);

    // Reset form
    setNewTitle("");
    setNewBuyerName("");
    setNewDescription("");
    setNewContactEmail("");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full min-w-0">
      {/* Top Banner Header */}
      <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full">
                <Briefcase className="w-3.5 h-3.5" />
                Demandes d'Achat Industrielles & Appels d'Offres
              </span>
              <span className="text-xs text-stone-400 hidden sm:inline">
                Sourcing direct des fonderies et usines
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-100 tracking-tight">
              Appels d'Offres & Besoins des Acheteurs
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Consultez les demandes d'approvisionnement des fonderies internationales, cimenteries et usines de traitement, ou déposez votre propre cahier des charges d'achat.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition shadow-lg shadow-amber-950/40 self-start md:self-center cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Déposer un Appel d'Offres</span>
          </button>
        </div>

        {/* Search and Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-6 pt-6 border-t border-stone-800">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Rechercher par minerai, acheteur ou port (ex: Cuivre, Trafigura, Nador)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-950/80 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-stone-950/80 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Toutes substances</option>
              <option value="cuivre">Cuivre</option>
              <option value="argent">Argent</option>
              <option value="cobalt">Cobalt</option>
              <option value="barite">Barytine</option>
              <option value="phosphate">Phosphate</option>
              <option value="zinc">Zinc</option>
              <option value="plomb">Plomb</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full bg-stone-950/80 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">Tous délais</option>
              <option value="Immédiat (< 15j)">Urgent (&lt; 15 jours)</option>
              <option value="Court Terme (< 30j)">Court Terme (&lt; 30 jours)</option>
              <option value="Contrat Annuel / Régulier">Contrat Annuel Cadre</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tender Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-stone-400 px-1">
          <span>{filteredRequests.length} appel(s) d'offres en cours</span>
          <span>Actualisation en direct</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRequests.map((req) => {
            const isUrgent = req.urgency.includes("Immédiat");
            return (
              <div
                key={req.id}
                className="bg-stone-900/40 border border-stone-800 hover:border-stone-700 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-sm transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-stone-950 border border-stone-800 text-stone-400">
                        {req.id}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        {req.category}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        isUrgent
                          ? "bg-rose-500/15 border border-rose-500/30 text-rose-400 animate-pulse"
                          : "bg-blue-500/15 border border-blue-500/30 text-blue-400"
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {req.urgency}
                    </span>
                  </div>

                  {/* Title & Buyer */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-stone-100 leading-tight">
                      {req.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-stone-400 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-amber-500" />
                      <span className="font-semibold text-stone-300">{req.buyerName}</span>
                      <span>•</span>
                      <span className="text-stone-400">{req.buyerType}</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
                    {req.description}
                  </p>

                  {/* Specifications Bento Box */}
                  <div className="bg-stone-950/80 rounded-2xl p-3.5 border border-stone-800/80 space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-stone-500 block uppercase">Quantité Recherchée</span>
                        <strong className="text-stone-200 font-mono text-xs sm:text-sm">
                          {req.desiredQuantity}
                        </strong>
                      </div>

                      <div>
                        <span className="text-[10px] text-stone-500 block uppercase">Teneur Minimale Requise</span>
                        <strong className="text-amber-400 font-mono text-xs sm:text-sm">
                          {req.minGrade}
                        </strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[11px]">
                      <span className="text-stone-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-500" />
                        <span>Rendu : {req.destinationPortOrCity} ({req.deliveryTerms})</span>
                      </span>

                      {req.targetPriceMAD && (
                        <span className="font-mono font-bold text-emerald-400">
                          Budget Cible : ~{req.targetPriceMAD.toLocaleString("fr-FR")} MAD/t
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer and Response button */}
                <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-stone-500 flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>Limite : {req.deadline}</span>
                    <span>•</span>
                    <span className="text-amber-400 font-medium">{req.responsesCount} proposition(s)</span>
                  </div>

                  <button
                    onClick={() => handleOpenRespondModal(req)}
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3.5 py-1.5 rounded-xl text-xs transition shadow-sm cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Proposer un Lot</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal to Respond to Tender */}
      {respondingTender && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-stone-100 space-y-5">
            <div className="flex items-start justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  Répondre à l'Appel d'Offres
                </span>
                <h3 className="text-base font-bold text-stone-100 mt-1">
                  {respondingTender.title}
                </h3>
                <p className="text-xs text-stone-400">
                  Destinataire : {respondingTender.buyerName}
                </p>
              </div>
              <button
                onClick={() => setRespondingTender(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitResponse} className="space-y-4 text-xs">
              {/* Option to link existing listing */}
              <div className="space-y-1">
                <label className="text-stone-300 font-semibold block">
                  Associer un de vos lots existants (Optionnel)
                </label>
                <select
                  value={selectedLotToOffer}
                  onChange={(e) => {
                    setSelectedLotToOffer(e.target.value);
                    const found = listings.find((l) => l.id === e.target.value);
                    if (found) setOfferedPriceMAD(found.priceMAD);
                  }}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Aucun (Saisie manuelle d'offre) --</option>
                  {listings.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title} ({l.grade}, {l.quantity})
                    </option>
                  ))}
                </select>
              </div>

              {/* Price proposal */}
              <div className="space-y-1">
                <label className="text-stone-300 font-semibold block">
                  Votre Prix Proposé (MAD / Tonne - {respondingTender.deliveryTerms})
                </label>
                <input
                  type="number"
                  required
                  value={offeredPriceMAD}
                  onChange={(e) => setOfferedPriceMAD(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Contact info */}
              <div className="space-y-1">
                <label className="text-stone-300 font-semibold block">
                  Vos Coordonnées (Téléphone & Société)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Société Minière de l'Atlas - +212 6 XX XX XX XX"
                  value={responseContact}
                  onChange={(e) => setResponseContact(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="text-stone-300 font-semibold block">
                  Message technique / Précisions sur la teneur
                </label>
                <textarea
                  rows={3}
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRespondingTender(null)}
                  className="px-4 py-2 rounded-xl border border-stone-800 text-stone-300 hover:bg-stone-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer la Proposition</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal to Create New Tender */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-stone-100 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  Nouveau Cahier des Charges
                </span>
                <h3 className="text-lg font-bold text-stone-100 mt-1">
                  Déposer un Appel d'Offres d'Approvisionnement
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTenderSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="text-stone-300 font-semibold block">Titre de l'Appel d'Offres *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Achat 2 000 t Concentré de Plomb (Pb ≥ 60%)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-stone-300 font-semibold block">Entité Acheteuse *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ciments du Maroc / Fonderie X"
                    value={newBuyerName}
                    onChange={(e) => setNewBuyerName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-stone-300 font-semibold block">Type d'Industrie</label>
                  <select
                    value={newBuyerType}
                    onChange={(e) => setNewBuyerType(e.target.value as BuyerRequest["buyerType"])}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Fonderie Internationale">Fonderie Internationale</option>
                    <option value="Usine Chimique / Traitement">Usine Chimique / Traitement</option>
                    <option value="Trader / Négociant Export">Trader / Négociant Export</option>
                    <option value="Cimenterie">Cimenterie</option>
                    <option value="Industrie Énergétique / Forage">Industrie Énergétique / Forage</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-stone-300 font-semibold block">Substance Minérale</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as BuyerRequest["category"])}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="cuivre">Cuivre</option>
                    <option value="argent">Argent</option>
                    <option value="cobalt">Cobalt</option>
                    <option value="barite">Barytine</option>
                    <option value="phosphate">Phosphate</option>
                    <option value="zinc">Zinc</option>
                    <option value="plomb">Plomb</option>
                    <option value="fer">Fer</option>
                    <option value="manganese">Manganèse</option>
                    <option value="fluorine">Fluorine</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-stone-300 font-semibold block">Quantité Voulue</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 2 500 Tonnes"
                    value={newQuantity}
                    onChange={(e) => {
                      setNewQuantity(e.target.value);
                      const num = parseInt(e.target.value.replace(/\D/g, ""), 10);
                      if (num) setNewQuantityNumber(num);
                    }}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-stone-300 font-semibold block">Teneur Minimale</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Cu ≥ 22%, BaSO4 ≥ 90%"
                    value={newMinGrade}
                    onChange={(e) => setNewMinGrade(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-stone-300 font-semibold block">Incoterm Souhaité</label>
                  <select
                    value={newDeliveryTerms}
                    onChange={(e) => setNewDeliveryTerms(e.target.value as BuyerRequest["deliveryTerms"])}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="FOB Casablanca">FOB Casablanca</option>
                    <option value="FOB Jorf Lasfar">FOB Jorf Lasfar</option>
                    <option value="FOB Nador">FOB Nador</option>
                    <option value="FOB Agadir">FOB Agadir</option>
                    <option value="Rendu Usine (DDP)">Rendu Usine (DDP)</option>
                    <option value="EXW Mine">EXW Mine</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-stone-300 font-semibold block">Budget Cible (MAD / tonne)</label>
                  <input
                    type="number"
                    value={newTargetPriceMAD}
                    onChange={(e) => setNewTargetPriceMAD(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-stone-300 font-semibold block">Email de Contact *</label>
                  <input
                    type="email"
                    required
                    placeholder="acheteur@entreprise.com"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-stone-300 font-semibold block">Date Limite de Soumission</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-stone-300 font-semibold block">Détails et Exigences Techniques</label>
                <textarea
                  rows={3}
                  placeholder="Spécifiez les pénalités d'impuretés acceptées, les conditions de paiement (LC à vue, acompte), ou les normes d'échantillonnage."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-800 text-stone-300 hover:bg-stone-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-md shadow-amber-950/40"
                >
                  Publier l'Appel d'Offres
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
