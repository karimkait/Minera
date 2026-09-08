import React, { useState } from "react";
import { MineralListing } from "../types";
import { X, Send, CheckCircle2, MessageSquare, Building2, Phone, Mail } from "lucide-react";

interface ContactSellerModalProps {
  lot: MineralListing | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ContactSellerModal: React.FC<ContactSellerModalProps> = ({
  lot,
  isOpen,
  onClose,
}) => {
  const [buyerName, setBuyerName] = useState("");
  const [buyerCompany, setBuyerCompany] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("+212 ");
  const [requestedTonnage, setRequestedTonnage] = useState(lot?.quantityNumber || 500);
  const [targetPriceMAD, setTargetPriceMAD] = useState(lot?.priceMAD || 1000);
  const [message, setMessage] = useState(
    `Bonjour, nous sommes intéressés par l'achat d'un lot de ${lot?.title || "minerai"}. Merci de nous transmettre vos conditions de paiement et le bulletin d'échantillonnage détaillé.`
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !lot) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl text-stone-100">
        <div className="p-6 border-b border-stone-800 flex items-start justify-between sticky top-0 bg-stone-900/95 backdrop-blur-md z-10">
          <div>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
              Demande de Cotation / Devis
            </span>
            <h2 className="text-lg font-bold text-stone-100 mt-0.5">
              Contacter {lot.sellerName}
            </h2>
            <p className="text-xs text-stone-400">Concernant le lot: {lot.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-stone-100">Demande envoyée avec succès !</h3>
            <p className="text-xs text-stone-400 max-w-xs mx-auto">
              Le vendeur ({lot.sellerName}) a reçu vos coordonnées et vous répondra sous 24h ouvrées avec les documents techniques.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-stone-300">Votre Nom / Contact</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Ex: Karim Bennani"
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-300">Société / Comptoir</label>
                <input
                  type="text"
                  required
                  value={buyerCompany}
                  onChange={(e) => setBuyerCompany(e.target.value)}
                  placeholder="Ex: Trading Minier Maroc"
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-300">Email Professionnel</label>
                <input
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="contact@societe.ma"
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-300">Téléphone (WhatsApp)</label>
                <input
                  type="tel"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-300">Tonnage souhaité (t)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={requestedTonnage}
                  onChange={(e) => setRequestedTonnage(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-2xl text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-300">Offre indicative (MAD/t)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={targetPriceMAD}
                  onChange={(e) => setTargetPriceMAD(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-2xl text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-300">Message & Exigences particulières</label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
              />
            </div>

            <div className="pt-3 border-t border-stone-800 flex items-center justify-end gap-3">
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
                <Send className="w-3.5 h-3.5" />
                <span>Transmettre la Cotation</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
