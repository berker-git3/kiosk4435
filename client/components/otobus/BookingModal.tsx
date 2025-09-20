import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

// Booking modal with seat map -> passenger info -> payment (Card.js) flow
export default function BookingModal({ open, trip, onClose, onConfirm }: any) {
  const [step, setStep] = useState<"seats" | "passengers" | "payment">("seats");
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [passengers, setPassengers] = useState<any[]>([]);
  const [loadingCardJs, setLoadingCardJs] = useState(false);
  const cardFormRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (!open) {
      setStep("seats");
      setSelectedSeats([]);
      setPassengers([]);
    }
  }, [open]);

  if (!open || !trip) return null;

  // Build a seat map (rows x cols) based on 54 seats as example, mimic image layout
  const seatCount = 54;
  const seatsPerRow = useMemo(() => [2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], []);

  // Determine occupied seats: use trip.occupied if provided, otherwise simulate
  const occupiedSet = useMemo(() => new Set<number>(trip.occupied || [3, 7, 12, 28, 33, 45]), [trip]);

  const toggleSeat = (n: number) => {
    if (occupiedSet.has(n)) return;
    setSelectedSeats((s) => {
      if (s.includes(n)) return s.filter((x) => x !== n);
      return [...s, n].sort((a, b) => a - b);
    });
  };

  useEffect(() => {
    // make sure passengers array matches selectedSeats
    setPassengers((p) => {
      const next = selectedSeats.map((s, i) => p[i] || { seat: s, name: "", surname: "", tc: "", phone: "", email: "", extras: [], note: "" });
      return next;
    });
  }, [selectedSeats]);

  // Load Card.js when entering payment step
  useEffect(() => {
    if (step !== "payment") return;
    setLoadingCardJs(true);
    const jqId = "_cb_jquery";
    if (!(window as any).jQuery) {
      const jq = document.createElement("script");
      jq.src = "https://code.jquery.com/jquery-3.6.0.min.js";
      jq.async = true;
      jq.id = jqId;
      document.head.appendChild(jq);
      jq.onload = loadCard;
    } else {
      loadCard();
    }

    function loadCard() {
      if ((window as any).Card) {
        setLoadingCardJs(false);
        return;
      }
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/card@2.5.0/dist/card.css";
      document.head.appendChild(link);
      const c = document.createElement("script");
      c.src = "https://unpkg.com/card@2.5.0/dist/card.min.js";
      c.async = true;
      c.onload = () => {
        const Card = (window as any).Card;
        if (Card && cardFormRef.current) {
          try {
            new Card({
              form: cardFormRef.current, // or '#payment-form'
              container: ".card-wrapper",
              formSelectors: {
                numberInput: "#card-number",
                expiryInput: "#card-expiry",
                cvcInput: "#card-cvc",
                nameInput: "#card-name",
              },
            });
          } catch (e) {
            // ignore
          }
        }
        setLoadingCardJs(false);
      };
      document.head.appendChild(c);
    }
  }, [step]);

  const proceedToPassengers = () => {
    if (selectedSeats.length === 0) {
      alert("Lütfen en az 1 koltuk seçin.");
      return;
    }
    setStep("passengers");
  };

  const proceedToPayment = () => {
    // basic validation
    for (const p of passengers) {
      if (!p.name || !p.surname) {
        alert("Lütfen yolcu adı soyadı girin.");
        return;
      }
    }
    setStep("payment");
  };

  const confirmBooking = (paymentResult?: any) => {
    // collate booking
    const booking = {
      trip,
      seats: selectedSeats,
      passengers,
      payment: paymentResult || { method: "card" },
    };
    onConfirm && onConfirm(booking);
    onClose && onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center overflow-auto bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg w-[min(1100px,98%)] max-h-[95vh] overflow-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">{trip.operator} - {trip.depart} → {trip.arrive}</h3>
          <div className="flex items-center gap-2">
            <div className="text-sm text-slate-500">Adımlar: Koltuk → Yolcu → Ödeme</div>
            <button onClick={onClose} className="px-3 py-1 rounded border">Kapat</button>
          </div>
        </div>

        <div className="p-6">
          {step === "seats" && (
            <div>
              <h4 className="font-medium mb-3">Koltuk Seçimi</h4>
              <div className="mb-3 text-sm text-slate-600">Dolu koltuklar <span className="inline-block w-4 h-4 bg-red-600 ml-2 align-middle rounded-sm" /> , Boş koltuklar <span className="inline-block w-4 h-4 bg-green-500 ml-2 align-middle rounded-sm" /></div>
              <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
                {Array.from({ length: seatCount }).map((_, idx) => {
                  const n = idx + 1;
                  const isOcc = occupiedSet.has(n);
                  const isSel = selectedSeats.includes(n);
                  const cls = isOcc ? "bg-red-600 cursor-not-allowed" : isSel ? "bg-green-500 transform scale-105 shadow-lg" : "bg-white hover:bg-green-100";
                  return (
                    <button
                      key={n}
                      onClick={() => toggleSeat(n)}
                      disabled={isOcc}
                      className={`border rounded-md p-2 text-xs transition-all duration-150 ease-in-out ${cls} ${isSel ? "border-2 border-black" : "border-slate-200"}`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 rounded-md border">İptal</button>
                <Button className="bg-black text-white" onClick={proceedToPassengers}>Devam</Button>
              </div>
            </div>
          )}

          {step === "passengers" && (
            <div>
              <h4 className="font-medium mb-3">Yolcu Bilgileri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedSeats.map((s, i) => (
                  <div key={s} className="p-4 border rounded">
                    <div className="font-semibold mb-2">Koltuk {s}</div>
                    <div className="grid grid-cols-1 gap-2">
                      <input placeholder="Ad" value={passengers[i]?.name || ""} onChange={(e) => setPassengers((p) => { const c = [...p]; c[i] = { ...(c[i] || {}), name: e.target.value, seat: s }; return c; })} className="w-full rounded-md border px-3 py-2" />
                      <input placeholder="Soyad" value={passengers[i]?.surname || ""} onChange={(e) => setPassengers((p) => { const c = [...p]; c[i] = { ...(c[i] || {}), surname: e.target.value, seat: s }; return c; })} className="w-full rounded-md border px-3 py-2" />
                      <input placeholder="TC Kimlik" value={passengers[i]?.tc || ""} onChange={(e) => setPassengers((p) => { const c = [...p]; c[i] = { ...(c[i] || {}), tc: e.target.value, seat: s }; return c; })} className="w-full rounded-md border px-3 py-2" />
                      <input placeholder="Telefon" value={passengers[i]?.phone || ""} onChange={(e) => setPassengers((p) => { const c = [...p]; c[i] = { ...(c[i] || {}), phone: e.target.value, seat: s }; return c; })} className="w-full rounded-md border px-3 py-2" />
                      <input placeholder="E-posta" value={passengers[i]?.email || ""} onChange={(e) => setPassengers((p) => { const c = [...p]; c[i] = { ...(c[i] || {}), email: e.target.value, seat: s }; return c; })} className="w-full rounded-md border px-3 py-2" />
                      <div className="flex items-center gap-2 mt-2">
                        <label className="text-sm mr-2">Ek Hizmetler:</label>
                        <label className="flex items-center gap-2"><input type="checkbox" onChange={(e) => setPassengers((p) => { const c = [...p]; const arr = (c[i]?.extras || []); if (e.target.checked) arr.push("bagage"); else { const idx = arr.indexOf("bagage"); if (idx > -1) arr.splice(idx, 1); } c[i] = { ...(c[i] || {}), extras: arr }; return c; })} /> Bagaj</label>
                        <label className="flex items-center gap-2"><input type="checkbox" onChange={(e) => setPassengers((p) => { const c = [...p]; const arr = (c[i]?.extras || []); if (e.target.checked) arr.push("meal"); else { const idx = arr.indexOf("meal"); if (idx > -1) arr.splice(idx, 1); } c[i] = { ...(c[i] || {}), extras: arr }; return c; })} /> Yemek</label>
                      </div>
                      <textarea placeholder="Not" value={passengers[i]?.note || ""} onChange={(e) => setPassengers((p) => { const c = [...p]; c[i] = { ...(c[i] || {}), note: e.target.value }; return c; })} className="w-full rounded-md border px-3 py-2 mt-2" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button onClick={() => setStep("seats")} className="px-4 py-2 rounded-md border">Geri</button>
                <div className="flex items-center gap-3">
                  <button onClick={onClose} className="px-4 py-2 rounded-md border">İptal</button>
                  <Button className="bg-black text-white" onClick={proceedToPayment}>Ödeme</Button>
                </div>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div>
              <h4 className="font-medium mb-3">Ödeme Bilgileri</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="card-wrapper mb-4" />
                  <form id="payment-form" ref={(el) => (cardFormRef.current = el)} className="space-y-3">
                    <div>
                      <label className="block text-xs">Kart Üzerindeki İsim</label>
                      <input id="card-name" name="name" className="w-full rounded-md border px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-xs">Kart Numarası</label>
                      <input id="card-number" name="number" className="w-full rounded-md border px-3 py-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs">Son Kullanma (MM/YY)</label>
                        <input id="card-expiry" name="expiry" className="w-full rounded-md border px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-xs">CVC</label>
                        <input id="card-cvc" name="cvc" className="w-full rounded-md border px-3 py-2" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <button onClick={() => setStep("passengers")} type="button" className="px-4 py-2 rounded-md border">Geri</button>
                      <div className="flex items-center gap-3">
                        <button onClick={onClose} className="px-4 py-2 rounded-md border">İptal</button>
                        <Button className="bg-black text-white" onClick={() => confirmBooking({ method: "card" })}>ÖDEME Yap</Button>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="p-4 border rounded">
                  <h5 className="font-semibold mb-2">Rezervasyon Özeti</h5>
                  <div>Koltuklar: {selectedSeats.join(", ")}</div>
                  <div className="mt-2">Toplam Kişi: {selectedSeats.length}</div>
                  <div className="mt-2">Toplam Tutar: {selectedSeats.length * trip.price}₺</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
