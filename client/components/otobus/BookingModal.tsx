import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import VoucherModal from "./VoucherModal";

// Booking modal with seat map -> passenger info -> payment (Card.js) flow
export default function BookingModal({ open, trip, onClose, onConfirm }: any) {
  const [step, setStep] = useState<"seats" | "passengers" | "payment">("seats");
  const [selectedSeats, setSelectedSeats] = useState<
    { seat: number; gender: string | null }[]
  >([]);
  const [passengers, setPassengers] = useState<any[]>([]);
  const [loadingCardJs, setLoadingCardJs] = useState(false);
  const cardFormRef = useRef<HTMLFormElement | null>(null);

  const [reservation, setReservation] = useState<any | null>(null);
  const [voucherOpen, setVoucherOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setStep("seats");
      setSelectedSeats([]);
      setPassengers([]);
    }
  }, [open]);

  if (!open || !trip) return null;

  // Build a seat map (rows x cols) based on 54 seats as example, can be overridden by seatmap JSON in /assets/seatmaps/{trip.id}.json
  const seatCount = 54;
  const [seatLayout, setSeatLayout] = useState<number[][] | null>(null);
  useEffect(() => {
    // try to load seatmap JSON uploaded to public/assets/seatmaps/{trip.id}.json
    const url = `/assets/seatmaps/${trip.id || "default"}.json`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((data) => {
        // expected format: array of rows, each row is array of numbers or null for empty space
        if (Array.isArray(data)) setSeatLayout(data as number[][]);
      })
      .catch(() => setSeatLayout(null));
  }, [trip]);

  // Determine occupied seats: use trip.occupied if provided, otherwise simulate
  const occupiedSet = useMemo(
    () => new Set<number>(trip.occupied || [3, 7, 12, 28, 33, 45]),
    [trip],
  );

  const toggleSeat = (n: number) => {
    if (occupiedSet.has(n)) return;
    setSelectedSeats((s) => {
      const exists = s.find((it) => it.seat === n);
      if (exists) return s.filter((x) => x.seat !== n);
      return [...s, { seat: n, gender: null }].sort((a, b) => a.seat - b.seat);
    });
  };

  useEffect(() => {
    // make sure passengers array matches selectedSeats
    setPassengers((p) => {
      const next = selectedSeats.map(
        (s, i) =>
          p[i] || {
            seat: s.seat,
            name: "",
            surname: "",
            tc: "",
            phone: "",
            email: "",
            extras: [],
            note: "",
            gender: s.gender || null,
          },
      );
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

  const gatewayFormRef = useRef<HTMLFormElement | null>(null);

  const confirmBooking = (paymentResult?: any) => {
    // collate booking
    const code = Math.random()
      .toString(36)
      .toUpperCase()
      .slice(2, 10)
      .replace(/[^A-Z0-9]/g, "0")
      .slice(0, 8);
    const booking = {
      code,
      trip: { ...trip },
      seats: selectedSeats,
      passengers,
      payment: paymentResult || { method: "card" },
      createdAt: new Date().toISOString(),
    };
    console.log("[BookingModal] confirmBooking booking=", booking);
    setReservation(booking);
    setVoucherOpen(true);
    console.log("[BookingModal] voucherOpen set true");
    onConfirm && onConfirm(booking);
  };

  // Detect gateway return page storing a marker in localStorage and show voucher
  useEffect(() => {
    if (!open) return;
    try {
      const raw = window.localStorage.getItem("payment_result");
      if (raw) {
        window.localStorage.removeItem("payment_result");
        const pr = JSON.parse(raw);
        if (pr && pr.success) {
          console.log(
            "[BookingModal] detected payment_result from gateway, confirming booking",
          );
          confirmBooking({ method: "vakif", gatewayResult: pr });
        }
      }
    } catch (e) {
      console.error("[BookingModal] error reading payment_result", e);
    }
  }, [open]);

  const handleVakifPayment = async () => {
    const orderId = `BUS-${Date.now()}`;
    const amount = selectedSeats.length * trip.price;
    try {
      const payload = {
        amount,
        orderId,
        currency: "TRY",
        description: `Bus ${trip.from}->${trip.to}`,
      };
      const res = await fetch("/api/payments/vakif/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Try reading response text safely even if the body was consumed elsewhere
      let text = "";
      try {
        text = await res.text();
      } catch (e1) {
        console.warn(
          "[BookingModal] primary res.text() failed, attempting clone():",
          e1,
        );
        try {
          if ((res as any).clone) {
            text = await (res as any).clone().text();
          }
        } catch (e2) {
          console.error(
            "[BookingModal] failed to read response body even after clone",
            e2,
          );
          throw e2 || e1;
        }
      }

      if (!res.ok) {
        let msg = text || "Vakıf init failed";
        try {
          const parsed = JSON.parse(text);
          if (parsed && parsed.error) msg = parsed.error;
        } catch {}
        throw new Error(msg);
      }

      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Invalid JSON from Vakif init response");
      }

      const form = gatewayFormRef.current;
      if (!form) return;
      if (!data || !data.gatewayUrl || !data.fields) {
        console.error(
          "[BookingModal] Vakif init returned invalid payload",
          data,
        );
        throw new Error("Vakıf init returned invalid payload");
      }

      form.action = data.gatewayUrl;
      form.method = "POST";
      while (form.firstChild) form.removeChild(form.firstChild);
      Object.entries(data.fields).forEach(([k, v]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = String(v);
        form.appendChild(input);
      });
      form.submit();
    } catch (err: any) {
      console.error("[BookingModal] Vakif init error", err);
      alert("Ödeme başlatılamadı, rezervasyon lokal olarak kaydedildi.");
      confirmBooking({
        method: "vakif",
        fallback: true,
        error: String(err?.message || err),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center overflow-auto bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg w-[min(1100px,98%)] max-h-[95vh] overflow-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">
            {trip.operator} - {trip.depart} → {trip.arrive}
          </h3>
          <div className="flex items-center gap-2">
            <div className="text-sm text-slate-500">
              Adımlar: Koltuk → Yolcu → ��deme
            </div>
            <button onClick={onClose} className="px-3 py-1 rounded border">
              Kapat
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === "seats" && (
            <div>
              <h4 className="font-medium mb-3">Koltuk Seçimi</h4>
              <div className="mb-3 text-sm text-slate-600">
                Dolu koltuklar{" "}
                <span className="inline-block w-4 h-4 bg-red-600 ml-2 align-middle rounded-sm" />{" "}
                , Boş koltuklar{" "}
                <span className="inline-block w-4 h-4 bg-green-500 ml-2 align-middle rounded-sm" />
              </div>
              {seatLayout ? (
                <div className="space-y-1">
                  {seatLayout.map((row, ri) => (
                    <div key={ri} className="flex gap-2">
                      {row.map((cell, ci) => {
                        if (cell === null)
                          return <div key={ci} className="w-8" />;
                        const n = cell;
                        const isOcc = occupiedSet.has(n);
                        const selObj = selectedSeats.find(
                          (it) => it.seat === n,
                        );
                        const isSel = !!selObj;
                        const cls = isOcc
                          ? "bg-red-600 cursor-not-allowed text-white"
                          : isSel
                            ? "bg-green-500 transform scale-105 shadow-lg text-white"
                            : "bg-white hover:bg-green-100";
                        return (
                          <button
                            key={n}
                            onClick={() => toggleSeat(n)}
                            disabled={isOcc}
                            className={`w-8 h-8 flex items-center justify-center border rounded-md text-xs transition-all duration-150 ease-in-out ${cls} ${isSel ? "border-2 border-black" : "border-slate-200"}`}
                            title={
                              isSel
                                ? `Seçili (${selObj?.gender || "Cinsiyet seçilmeyen"})`
                                : `Koltuk ${n}`
                            }
                          >
                            <div className="flex flex-col items-center">
                              <span>{n}</span>
                              {selObj?.gender === "female" && (
                                <span className="text-pink-600 text-[10px]">
                                  ♀
                                </span>
                              )}
                              {selObj?.gender === "male" && (
                                <span className="text-blue-600 text-[10px]">
                                  ♂
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="grid gap-2"
                  style={{ gridTemplateColumns: "repeat(12, 1fr)" }}
                >
                  {Array.from({ length: seatCount }).map((_, idx) => {
                    const n = idx + 1;
                    const isOcc = occupiedSet.has(n);
                    const selObj = selectedSeats.find((it) => it.seat === n);
                    const isSel = !!selObj;
                    const cls = isOcc
                      ? "bg-red-600 cursor-not-allowed text-white"
                      : isSel
                        ? "bg-green-500 transform scale-105 shadow-lg text-white"
                        : "bg-white hover:bg-green-100";
                    return (
                      <button
                        key={n}
                        onClick={() => toggleSeat(n)}
                        disabled={isOcc}
                        className={`border rounded-md p-2 text-xs transition-all duration-150 ease-in-out ${cls} ${isSel ? "border-2 border-black" : "border-slate-200"}`}
                        title={
                          isSel
                            ? `Seçili (${selObj?.gender || "Cinsiyet seçilmeyen"})`
                            : `Koltuk ${n}`
                        }
                      >
                        <div className="flex flex-col items-center">
                          <span>{n}</span>
                          {selObj?.gender === "female" && (
                            <span className="text-pink-600 text-[10px]">
                              ♀
                            </span>
                          )}
                          {selObj?.gender === "male" && (
                            <span className="text-blue-600 text-[10px]">
                              ♂
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="mt-4 flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-md border"
                >
                  İptal
                </button>
                <Button
                  className="bg-black text-white"
                  onClick={proceedToPassengers}
                >
                  Devam
                </Button>
              </div>
            </div>
          )}

          {step === "passengers" && (
            <div>
              <h4 className="font-medium mb-3">Yolcu Bilgileri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedSeats.map((sObj, i) => (
                  <div key={sObj.seat} className="p-4 border rounded">
                    <div className="font-semibold mb-2">Koltuk {sObj.seat}</div>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center gap-2">
                        <label className="text-sm">Cinsiyet:</label>
                        <label
                          className={`px-2 py-1 rounded border ${sObj.gender === "male" ? "bg-blue-100" : ""}`}
                        >
                          <input
                            type="radio"
                            name={`gender-${sObj.seat}`}
                            checked={sObj.gender === "male"}
                            onChange={() => {
                              setSelectedSeats((ss) =>
                                ss.map((x) =>
                                  x.seat === sObj.seat
                                    ? { ...x, gender: "male" }
                                    : x,
                                ),
                              );
                              setPassengers((p) => {
                                const c = [...p];
                                c[i] = { ...(c[i] || {}), gender: "male" };
                                return c;
                              });
                            }}
                          />{" "}
                          Erkek
                        </label>
                        <label
                          className={`px-2 py-1 rounded border ${sObj.gender === "female" ? "bg-pink-100" : ""}`}
                        >
                          <input
                            type="radio"
                            name={`gender-${sObj.seat}`}
                            checked={sObj.gender === "female"}
                            onChange={() => {
                              setSelectedSeats((ss) =>
                                ss.map((x) =>
                                  x.seat === sObj.seat
                                    ? { ...x, gender: "female" }
                                    : x,
                                ),
                              );
                              setPassengers((p) => {
                                const c = [...p];
                                c[i] = { ...(c[i] || {}), gender: "female" };
                                return c;
                              });
                            }}
                          />{" "}
                          Kadın
                        </label>
                      </div>

                      <input
                        placeholder="Ad"
                        value={passengers[i]?.name || ""}
                        onChange={(e) =>
                          setPassengers((p) => {
                            const c = [...p];
                            c[i] = {
                              ...(c[i] || {}),
                              name: e.target.value,
                              seat: sObj.seat,
                            };
                            return c;
                          })
                        }
                        className="w-full rounded-md border px-3 py-2"
                      />
                      <input
                        placeholder="Soyad"
                        value={passengers[i]?.surname || ""}
                        onChange={(e) =>
                          setPassengers((p) => {
                            const c = [...p];
                            c[i] = {
                              ...(c[i] || {}),
                              surname: e.target.value,
                              seat: sObj.seat,
                            };
                            return c;
                          })
                        }
                        className="w-full rounded-md border px-3 py-2"
                      />
                      <input
                        placeholder="TC Kimlik"
                        value={passengers[i]?.tc || ""}
                        onChange={(e) =>
                          setPassengers((p) => {
                            const c = [...p];
                            c[i] = {
                              ...(c[i] || {}),
                              tc: e.target.value,
                              seat: sObj.seat,
                            };
                            return c;
                          })
                        }
                        className="w-full rounded-md border px-3 py-2"
                      />
                      <input
                        placeholder="Telefon"
                        value={passengers[i]?.phone || ""}
                        onChange={(e) =>
                          setPassengers((p) => {
                            const c = [...p];
                            c[i] = {
                              ...(c[i] || {}),
                              phone: e.target.value,
                              seat: sObj.seat,
                            };
                            return c;
                          })
                        }
                        className="w-full rounded-md border px-3 py-2"
                      />
                      <input
                        placeholder="E-posta"
                        value={passengers[i]?.email || ""}
                        onChange={(e) =>
                          setPassengers((p) => {
                            const c = [...p];
                            c[i] = {
                              ...(c[i] || {}),
                              email: e.target.value,
                              seat: sObj.seat,
                            };
                            return c;
                          })
                        }
                        className="w-full rounded-md border px-3 py-2"
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <label className="text-sm mr-2">Ek Hizmetler:</label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              setPassengers((p) => {
                                const c = [...p];
                                const arr = c[i]?.extras || [];
                                if (e.target.checked) arr.push("bagage");
                                else {
                                  const idx = arr.indexOf("bagage");
                                  if (idx > -1) arr.splice(idx, 1);
                                }
                                c[i] = { ...(c[i] || {}), extras: arr };
                                return c;
                              })
                            }
                          />{" "}
                          Bagaj
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              setPassengers((p) => {
                                const c = [...p];
                                const arr = c[i]?.extras || [];
                                if (e.target.checked) arr.push("meal");
                                else {
                                  const idx = arr.indexOf("meal");
                                  if (idx > -1) arr.splice(idx, 1);
                                }
                                c[i] = { ...(c[i] || {}), extras: arr };
                                return c;
                              })
                            }
                          />{" "}
                          Yemek
                        </label>
                      </div>
                      <textarea
                        placeholder="Not"
                        value={passengers[i]?.note || ""}
                        onChange={(e) =>
                          setPassengers((p) => {
                            const c = [...p];
                            c[i] = { ...(c[i] || {}), note: e.target.value };
                            return c;
                          })
                        }
                        className="w-full rounded-md border px-3 py-2 mt-2"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => setStep("seats")}
                  className="px-4 py-2 rounded-md border"
                >
                  Geri
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-md border"
                  >
                    İptal
                  </button>
                  <Button
                    className="bg-black text-white"
                    onClick={proceedToPayment}
                  >
                    Ödeme
                  </Button>
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
                  <form
                    id="payment-form"
                    ref={(el) => (cardFormRef.current = el)}
                    className="space-y-3"
                  >
                    <div>
                      <label className="block text-xs">
                        Kart Üzerindeki İsim
                      </label>
                      <input
                        id="card-name"
                        name="name"
                        className="w-full rounded-md border px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs">Kart Numarası</label>
                      <input
                        id="card-number"
                        name="number"
                        className="w-full rounded-md border px-3 py-2"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs">
                          Son Kullanma (MM/YY)
                        </label>
                        <input
                          id="card-expiry"
                          name="expiry"
                          className="w-full rounded-md border px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs">CVC</label>
                        <input
                          id="card-cvc"
                          name="cvc"
                          className="w-full rounded-md border px-3 py-2"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setStep("passengers")}
                        type="button"
                        className="px-4 py-2 rounded-md border"
                      >
                        Geri
                      </button>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={onClose}
                          className="px-4 py-2 rounded-md border"
                        >
                          İptal
                        </button>
                        <Button
                          className="bg-black text-white"
                          onClick={() => handleVakifPayment()}
                        >
                          ÖDEME Yap
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="p-4 border rounded">
                  <h5 className="font-semibold mb-2">Rezervasyon Özeti</h5>
                  <div>
                    Koltuklar: {selectedSeats.map((s) => s.seat).join(", ")}
                  </div>
                  <div className="mt-2">
                    Toplam Kişi: {selectedSeats.length}
                  </div>
                  <div className="mt-2">
                    Toplam Tutar: {selectedSeats.length * trip.price}₺
                  </div>
                </div>
              </div>
            </div>
          )}
          <form
            ref={(el) => (gatewayFormRef.current = el)}
            style={{ display: "none" }}
          />
        </div>
      </div>
      <VoucherModal
        open={voucherOpen}
        reservation={reservation}
        onClose={() => {
          setVoucherOpen(false);
          onClose && onClose();
        }}
      />
    </div>
  );
}
