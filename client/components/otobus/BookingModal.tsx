import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function BookingModal({ open, trip, onClose, onConfirm }: any) {
  const [seats, setSeats] = useState(1);
  if (!open || !trip) return null;
  const max = Math.max(1, trip.seats || 1);
  const confirm = () => {
    onConfirm && onConfirm({ trip, seats });
    onClose && onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-6 w-[min(600px,95%)]">
        <h3 className="text-lg font-semibold mb-2">{trip.operator} - {trip.depart} → {trip.arrive}</h3>
        <div className="text-sm text-slate-600 mb-4">Kalan koltuk: {trip.seats}</div>
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm">Seçilecek koltuk sayısı</label>
          <input type="number" min={1} max={max} value={seats} onChange={(e) => setSeats(Math.min(max, Math.max(1, Number(e.target.value))))} className="w-24 rounded-md border px-2 py-1" />
        </div>
        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md border">İptal</button>
          <Button className="bg-black text-white" onClick={confirm}>Rezervasyon Yap</Button>
        </div>
      </div>
    </div>
  );
}
