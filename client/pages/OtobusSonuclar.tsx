import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FilterSidebar from "@/components/otobus/FilterSidebar";
import { Button } from "@/components/ui/button";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const MOCK = [
  {
    id: "1",
    operator: "Pamukkale",
    depart: "10:30",
    arrive: "13:25",
    duration: "2s 55dk",
    price: 900,
  },
  {
    id: "2",
    operator: "Pamukkale",
    depart: "12:30",
    arrive: "15:50",
    duration: "3s 20dk",
    price: 1000,
  },
  {
    id: "3",
    operator: "Flixbus",
    depart: "07:00",
    arrive: "09:30",
    duration: "2s 30dk",
    price: 797,
  },
];

export default function OtobusSonuclar() {
  const q = useQuery();
  const navigate = useNavigate();
  const from = q.get("from") || "";
  const to = q.get("to") || "";
  const date = q.get("date") || "";
  const [filters, setFilters] = useState({ search: "", operators: new Set<string>(), time: "" });

  const results = useMemo(() => {
    let data = MOCK.slice();
    if (filters.search) {
      data = data.filter((r) => r.operator.toLowerCase().includes(filters.search.toLowerCase()));
    }
    if (filters.operators.size) {
      data = data.filter((r) => filters.operators.has(r.operator));
    }
    return data;
  }, [filters]);

  return (
    <div className="w-full">
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">{from || "Nereden"} → {to || "Nereye"}</h1>
            <div className="text-sm text-slate-500">{date || "Tarih seçilmedi"}</div>
          </div>
          <div>
            <Button className="bg-red-600 text-white" onClick={() => navigate(-1)}>Yeni Arama</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6">
          <FilterSidebar value={{ search: filters.search }} onChange={(v:any) => setFilters((s)=>({ ...s, search: v.search }))} onReset={() => setFilters({ search: "", operators: new Set(), time: "" })} />

          <section>
            <div className="space-y-4">
              {results.map((r) => (
                <article key={r.id} className="flex flex-col md:flex-row items-center justify-between border rounded-lg p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="text-xl font-semibold">{r.depart}</div>
                      <div className="text-sm text-slate-500">{r.arrive}</div>
                      <div className="ml-4 text-sm text-slate-600">{r.operator}</div>
                    </div>
                    <div className="text-sm text-slate-500 mt-2">Süre: {r.duration}</div>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-4 flex items-center gap-4">
                    <div className="text-lg font-semibold">{r.price}₺</div>
                    <Button className="bg-black text-white">Seç</Button>
                  </div>
                </article>
              ))}

              {results.length === 0 && (
                <div className="p-6 border rounded text-center">Sefer bulunamadı.</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
