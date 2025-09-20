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
    eTicket: true,
    direct: true,
  },
  {
    id: "2",
    operator: "Pamukkale",
    depart: "12:30",
    arrive: "15:50",
    duration: "3s 20dk",
    price: 1000,
    eTicket: false,
    direct: true,
  },
  {
    id: "3",
    operator: "Flixbus",
    depart: "07:00",
    arrive: "09:30",
    duration: "2s 30dk",
    price: 797,
    eTicket: true,
    direct: false,
  },
  {
    id: "4",
    operator: "Metro",
    depart: "18:15",
    arrive: "21:50",
    duration: "3s 35dk",
    price: 850,
    eTicket: false,
    direct: false,
  },
];

export default function OtobusSonuclar() {
  const q = useQuery();
  const navigate = useNavigate();
  const from = q.get("from") || "";
  const to = q.get("to") || "";
  const date = q.get("date") || "";
  const [filters, setFilters] = useState({ search: "", operators: new Set<string>(), time: "" });

  const toggleOperator = (name: string) => {
    setFilters((s) => {
      const set = new Set(Array.from(s.operators));
      if (set.has(name)) set.delete(name);
      else set.add(name);
      return { ...s, operators: set };
    });
  };

  const results = useMemo(() => {
    let data = MOCK.slice();
    if (filters.search) {
      data = data.filter((r) => r.operator.toLowerCase().includes(filters.search.toLowerCase()) || r.depart.includes(filters.search));
    }
    if (filters.operators && filters.operators.size) {
      data = data.filter((r) => filters.operators.has(r.operator));
    }
    return data;
  }, [filters]);

  const getTimeBucket = (t: string) => {
    const [hh] = t.split(":");
    const h = Number(hh);
    if (h >= 6 && h < 11) return "early";
    if (h >= 11 && h < 17) return "noon";
    return "night";
  };

  const timeCounts = {
    early: MOCK.filter((m) => getTimeBucket(m.depart) === "early").length,
    noon: MOCK.filter((m) => getTimeBucket(m.depart) === "noon").length,
    night: MOCK.filter((m) => getTimeBucket(m.depart) === "night").length,
  };

  const operators = [
    { name: "Pamukkale", count: MOCK.filter((m) => m.operator === "Pamukkale").length, checked: filters.operators.has("Pamukkale") },
    { name: "Flixbus", count: MOCK.filter((m) => m.operator === "Flixbus").length, checked: filters.operators.has("Flixbus") },
    { name: "Metro", count: MOCK.filter((m) => m.operator === "Metro").length, checked: filters.operators.has("Metro") },
  ];

  const quickFilters = { eTicket: false, direct: false };

  const timeFilters = { early: false, noon: false, night: false, counts: timeCounts };

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
          <FilterSidebar operators={operators} onToggleOperator={toggleOperator} quickFilters={quickFilters} onToggleQuickFilter={() => {}} timeFilters={timeFilters} onToggleTimeFilter={() => {}} onReset={() => setFilters({ search: "", operators: new Set(), time: "" })} />

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
