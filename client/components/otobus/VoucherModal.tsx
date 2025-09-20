import React, { useRef } from "react";
import { Check, Printer, Mail, Phone } from "lucide-react";

export default function VoucherModal({ open, reservation, onClose }: any) {
  if (!open || !reservation) return null;
  const code = reservation.code || "";
  const printableRef = useRef<HTMLDivElement | null>(null);

  const getTrip = (k: string) => reservation?.trip?.[k] ?? "-";

  const handlePrint = () => {
    const content = printableRef.current?.innerHTML || "";
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) return;
    w.document.write(
      `<!doctype html><html><head><meta charset=\"utf-8\" /><title>Bilet ${code}</title><link rel=\"stylesheet\" href=\"/global.css\" /></head><body>${content}</body></html>`,
    );
    w.document.close();
    w.focus();
    setTimeout(() => {
      w.print();
      // do not auto-close to allow user to inspect
    }, 300);
  };

  const handleEmail = () => {
    const subject = `Rezervasyon ${code}`;
    const lines: string[] = [];
    lines.push(`Bilet Kodu: ${code}`);
    lines.push(`Firma: ${getTrip("operator")}`);
    lines.push(`Kalkış: ${getTrip("depart")} ${getTrip("date")}`);
    lines.push(`Varış (tahmini): ${getTrip("duration")}`);
    lines.push(
      `Otobüs: ${getTrip("busPlate")} - Kapasite: ${getTrip("capacity")}`,
    );
    lines.push(
      `Koltuklar: ${reservation.seats.map((s: any) => s.seat).join(", ")}`,
    );
    lines.push(`\nYolcular:`);
    reservation.passengers.forEach((p: any) => {
      lines.push(
        `${p.name} ${p.surname} (${p.gender || "-"}) - TC: ${p.tc || "-"} - Tel: ${p.phone || "-"} - E: ${p.email || "-"}`,
      );
    });
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center overflow-auto bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg w-[min(900px,98%)] p-6">
        <div className="flex flex-col items-center text-center">
          <div className="p-4 rounded-full bg-green-600 text-white inline-flex items-center justify-center mb-3">
            <Check className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold uppercase">İşleminiz tamamlandı</h2>
          <div className="mt-2 text-sm text-slate-600">
            Bilet kodunuz{" "}
            <span className="font-mono bg-slate-100 px-2 py-1 rounded ml-2">
              {code}
            </span>
          </div>
        </div>

        <div ref={printableRef} className="mt-6 space-y-4">
          <div className="p-4 rounded border bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-start md:items-center justify-between gap-4">
              <div>
                <div className="text-sm text-slate-500">Firma</div>
                <div className="font-semibold">{getTrip("operator")}</div>
              </div>

              <div>
                <div className="text-sm text-slate-500">Sefer</div>
                <div className="font-semibold">
                  {getTrip("depart")} → {getTrip("arrive")}
                </div>
                <div className="text-sm text-slate-500">Tarih / Kalkış</div>
                <div className="font-medium">
                  {getTrip("date")} /{" "}
                  {getTrip("time") || getTrip("departTime") || "-"}
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-500">Otobüs / Plaka</div>
                <div className="font-medium">{getTrip("busPlate") || "-"}</div>
                <div className="text-sm text-slate-500">Şoför</div>
                <div className="font-medium">{getTrip("driver") || "-"}</div>
              </div>

              <div className="text-right">
                <div className="text-sm text-slate-500">Tahmini Varış</div>
                <div className="font-medium">{getTrip("duration") || "-"}</div>
                <div className="text-sm text-slate-500">Toplam</div>
                <div className="font-medium">
                  {(reservation.seats?.length || 0) * (getTrip("price") || 0)}₺
                </div>
              </div>
            </div>

            <div className="mt-3 text-sm text-slate-600">
              Koltuklar:{" "}
              <span className="font-medium">
                {reservation.seats.map((s: any) => s.seat).join(", ")}
              </span>
            </div>
          </div>

          <div className="p-4 rounded border">
            <h4 className="font-semibold mb-2">Yolcular</h4>
            <div className="grid gap-3">
              {reservation.passengers.map((p: any, i: number) => (
                <div key={i} className="p-3 rounded bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {p.name} {p.surname}{" "}
                      <span className="text-sm text-slate-500">
                        ({p.gender || "-"})
                      </span>
                    </div>
                    <div className="text-sm text-slate-500">
                      Koltuk {p.seat}
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    TC: {p.tc || "-"} • Tel: {p.phone || "-"} • E-posta:{" "}
                    {p.email || "-"}
                  </div>
                  {p.extras && p.extras.length > 0 && (
                    <div className="text-sm mt-1">
                      Ekler: {p.extras.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border"
            >
              <Printer className="w-4 h-4" /> Yazdır
            </button>
            <button
              onClick={handleEmail}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border"
            >
              <Mail className="w-4 h-4" /> E-posta ile gönder
            </button>
            <a
              href="tel:+905558449900"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border"
            >
              <Phone className="w-4 h-4" /> Çağrı Merkezi
            </a>
          </div>

          <div>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-black text-white"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
