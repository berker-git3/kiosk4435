import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OtobusBileti() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [hasReturn, setHasReturn] = useState(false);
  const [adult, setAdult] = useState(1);
  const [young, setYoung] = useState(0);
  const [senior, setSenior] = useState(0);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      from,
      to,
      date,
      returnDate: hasReturn ? returnDate : "",
      adult: String(adult),
      young: String(young),
      senior: String(senior),
    });
    navigate(`/otobus-bileti/sonuclar?${params.toString()}`);
  }

  return (
    <div className="w-full">
      <header className="bg-black p-6 md:p-12 rounded-b-xl text-white">
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Otobüs Bileti Ara
          </h1>
          <p className="text-sm md:text-base max-w-2xl mb-6">
            Hızlıca nereden nereye gideceğinizi seçin, uygun seferleri bulun.
          </p>
          <form
            id="bus-search"
            onSubmit={onSubmit}
            className="bg-white rounded-xl p-4 md:p-6 shadow-md text-black max-w-5xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-600 mb-1">
                  Nereden
                </label>
                <Input
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="Nereden"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-slate-600 mb-1">
                  Nereye
                </label>
                <Input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Nereye"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Ne zaman
                </label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Yolcu Sayısı
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1">
                    <label className="text-xs">Yetişkin</label>
                    <input
                      className="w-12 rounded-md border px-2 py-1 ml-1"
                      type="number"
                      min={0}
                      value={adult}
                      onChange={(e) => setAdult(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              <div className="md:col-span-6 flex justify-end mt-2">
                <Button type="submit" className="bg-red-600 text-white">
                  Bilet Ara
                </Button>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 md:col-span-1">
                <input
                  id="hasReturn"
                  type="checkbox"
                  checked={hasReturn}
                  onChange={(e) => setHasReturn(e.target.checked)}
                  className="accent-red-600"
                />
                <label htmlFor="hasReturn" className="text-sm">
                  Gidiş-Dönüş
                </label>
              </div>
              {hasReturn && (
                <div className="md:col-span-1">
                  <label className="block text-xs text-slate-600 mb-1">
                    Dönüş Tarihi
                  </label>
                  <Input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </div>
              )}
              <div className="flex items-center gap-3 md:col-span-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs">Genç</label>
                  <input
                    className="w-12 rounded-md border px-2 py-1"
                    type="number"
                    min={0}
                    value={young}
                    onChange={(e) => setYoung(Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs">Yaşlı</label>
                  <input
                    className="w-12 rounded-md border px-2 py-1"
                    type="number"
                    min={0}
                    value={senior}
                    onChange={(e) => setSenior(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </header>
      <main className="container mx-auto py-8">
        <section>
          <h2 className="text-lg font-semibold mb-2">Popüler Rotalar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded">Antalya - Fethiye</div>
            <div className="p-4 border rounded">Antalya - Alanya</div>
            <div className="p-4 border rounded">Antalya - İstanbul</div>
          </div>
        </section>
      </main>
    </div>
  );
}
