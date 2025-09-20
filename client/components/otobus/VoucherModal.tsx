import React from "react";
import { Check } from "lucide-react";

export default function VoucherModal({ open, reservation, onClose }: any) {
  if (!open || !reservation) return null;
  const code = reservation.code || "";

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg w-[min(900px,98%)] p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-green-600 text-white">
            <Check className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Rezervasyon Tamamlandı</h3>
            <div className="text-sm text-slate-500">Bilet kodunuz <span className="font-mono bg-slate-100 px-2 py-1 rounded ml-2">{code}</span></div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded">
            <h4 className="font-semibold mb-2">Rezervasyon Detayları</h4>
            <div>Firma: {reservation.trip.operator}</div>
            <div>Otobüs: {reservation.trip.busPlate || "-"} - Kapasite: {reservation.trip.capacity || "-"}</div>
            <div>Şöför: {reservation.trip.driver || "-"}</div>
            <div>Kalkış: {reservation.trip.depart} - {reservation.trip.date || "-"}</div>
            <div>Varış yaklaşık: {reservation.trip.duration}</div>
            <div className="mt-2">Koltuklar: {reservation.seats.map((s:any)=>s.seat).join(", ")}</div>
          </div>

          <div className="p-4 border rounded">
            <h4 className="font-semibold mb-2">Yolcular</h4>
            <div className="space-y-2">
              {reservation.passengers.map((p:any, i:number) => (
                <div key={i} className="p-2 border rounded">
                  <div className="font-medium">{p.name} {p.surname} ({p.gender || '-'})</div>
                  <div className="text-sm">TC: {p.tc}</div>
                  <div className="text-sm">Tel: {p.phone}</div>
                  <div className="text-sm">E-posta: {p.email}</div>
                  <div className="text-sm">Ek: {(p.extras || []).join(", ")}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="px-3 py-2 rounded-md border flex items-center gap-2">Yazdır</button>
            <button onClick={() => { window.location.href = `mailto:?subject=Rezervasyon%20${code}&body=Rezervasyon%20detaylar%C4%B1%3A%0A%0A${encodeURIComponent(JSON.stringify(reservation, null, 2))}`}} className="px-3 py-2 rounded-md border flex items-center gap-2">E-posta ile gönder</button>
            <a href="tel:+905558449900" className="px-3 py-2 rounded-md border inline-flex items-center gap-2">Call Center</a>
          </div>
          <div>
            <button onClick={onClose} className="px-4 py-2 rounded-md bg-black text-white">Kapat</button>
          </div>
        </div>
      </div>
    </div>
  );
}
