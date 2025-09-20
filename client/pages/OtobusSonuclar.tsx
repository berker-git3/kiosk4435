import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FilterSidebar from "@/components/otobus/FilterSidebar";
import { Button } from "@/components/ui/button";
import ResultCard from "@/components/otobus/ResultCard";
import BookingModal from "@/components/otobus/BookingModal";

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
    seats: 12,
    features: ["wifi", "power", "toilet"],
    rating: 4.2,
    from: "Antalya",
    to: "Fethiye Otogarı",
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
    seats: 8,
    features: ["power"],
    rating: 4.0,
    from: "Antalya",
    to: "Fethiye Otogarı",
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
    seats: 20,
    features: ["wifi"],
    rating: 4.5,
    from: "Antalya Yeni Doğan",
    to: "Fethiye bus station",
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
    seats: 5,
    features: [],
    rating: 3.8,
    from: "Antalya",
    to: "Fethiye Otogarı",
  },
];

export default function OtobusSonuclar() {
  const q = useQuery();
  const navigate = useNavigate();
  const from = q.get("from") || "";
  const to = q.get("to") || "";
  const date = q.get("date") || "";
  const [filters, setFilters] = useState({
    search: "",
    operators: new Set<string>(),
    time: "",
  });

  const toggleOperator = (name: string) => {
    setFilters((s) => {
      const set = new Set(Array.from(s.operators));
      if (set.has(name)) set.delete(name);
      else set.add(name);
      return { ...s, operators: set };
    });
  };

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
    {
      name: "Pamukkale",
      count: MOCK.filter((m) => m.operator === "Pamukkale").length,
      checked: filters.operators.has("Pamukkale"),
    },
    {
      name: "Flixbus",
      count: MOCK.filter((m) => m.operator === "Flixbus").length,
      checked: filters.operators.has("Flixbus"),
    },
    {
      name: "Metro",
      count: MOCK.filter((m) => m.operator === "Metro").length,
      checked: filters.operators.has("Metro"),
    },
  ];

  const [quick, setQuick] = useState({ eTicket: false, direct: false });
  const [time, setTime] = useState({ early: false, noon: false, night: false });

  // Booking modal state
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  // Read initial filters from URL on mount
  React.useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const ops = qs.get("operators");
    const opSet = new Set<string>();
    if (ops) ops.split(",").forEach((o) => opSet.add(decodeURIComponent(o)));
    setFilters((s: any) => ({ ...s, operators: opSet }));
    setQuick({
      eTicket: qs.get("eticket") === "1",
      direct: qs.get("direct") === "1",
    });
    const t = qs.get("time");
    if (t) {
      setTime({
        early: t.includes("early"),
        noon: t.includes("noon"),
        night: t.includes("night"),
      });
    }
    const search = qs.get("search") || "";
    setFilters((s: any) => ({ ...s, search }));
  }, []);

  // Sync filters to URL
  const syncUrl = () => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.operators && filters.operators.size)
      params.set(
        "operators",
        Array.from(filters.operators).map(encodeURIComponent).join(","),
      );
    if (quick.eTicket) params.set("eticket", "1");
    if (quick.direct) params.set("direct", "1");
    const times: string[] = [];
    if (time.early) times.push("early");
    if (time.noon) times.push("noon");
    if (time.night) times.push("night");
    if (times.length) params.set("time", times.join(","));
    navigate({ search: params.toString() }, { replace: true });
  };

  React.useEffect(() => {
    syncUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.search,
    // use a stable string representation for operator set to avoid creating a new array each render
    filters.operators ? Array.from(filters.operators).sort().join(",") : "",
    quick.eTicket,
    quick.direct,
    time.early,
    time.noon,
    time.night,
  ]);

  const onToggleQuick = (key: string) => {
    setQuick((s) => ({ ...s, [key]: !s[key as keyof typeof s] }));
  };
  const onToggleTime = (key: string) => {
    setTime((s) => ({ ...s, [key]: !s[key as keyof typeof s] }));
  };

  const results = useMemo(() => {
    let data = MOCK.slice();
    if (filters.search) {
      data = data.filter(
        (r) =>
          r.operator.toLowerCase().includes(filters.search.toLowerCase()) ||
          r.depart.includes(filters.search) ||
          r.from.toLowerCase().includes(filters.search.toLowerCase()) ||
          r.to.toLowerCase().includes(filters.search.toLowerCase()),
      );
    }
    if (filters.operators && filters.operators.size) {
      data = data.filter((r) => filters.operators.has(r.operator));
    }
    if (quick.eTicket) data = data.filter((r) => r.eTicket);
    if (quick.direct) data = data.filter((r) => r.direct);
    if (time.early || time.noon || time.night) {
      data = data.filter((r) => {
        const b = getTimeBucket(r.depart);
        if (time.early && b === "early") return true;
        if (time.noon && b === "noon") return true;
        if (time.night && b === "night") return true;
        return false;
      });
    }
    return data;
  }, [filters, quick, time]);

  const quickFilters = { eTicket: quick.eTicket, direct: quick.direct };

  const timeFilters = {
    early: time.early,
    noon: time.noon,
    night: time.night,
    counts: timeCounts,
  };

  const onSelectTrip = (trip: any) => {
    setSelectedTrip(trip);
    setBookingOpen(true);
  };

  const onConfirmBooking = ({ trip, seats }: any) => {
    // For now simulate booking and show a success alert
    const code = Math.random().toString(36).toUpperCase().slice(2, 10);
    alert(
      `Rezervasyon başarılı: ${trip.operator} ${trip.depart} - Kod: ${code} (Koltuk: ${seats})`,
    );
  };

  return (
    <div className="w-full">
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">
              {from || "Nereden"} → {to || "Nereye"}
            </h1>
            <div className="text-sm text-slate-500">
              {date || "Tarih seçilmedi"}
            </div>
            <div className="mt-3">
              <input
                value={filters.search}
                onChange={(e) =>
                  setFilters((s: any) => ({ ...s, search: e.target.value }))
                }
                placeholder="Filtre veya operatör ara"
                className="w-full md:w-80 rounded-md border px-3 py-2"
              />
            </div>
          </div>
          <div>
            <Button
              className="bg-red-600 text-white"
              onClick={() => navigate(-1)}
            >
              Yeni Arama
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6">
          <FilterSidebar
            operators={operators}
            onToggleOperator={toggleOperator}
            quickFilters={quickFilters}
            onToggleQuickFilter={onToggleQuick}
            timeFilters={timeFilters}
            onToggleTimeFilter={onToggleTime}
            onReset={() =>
              setFilters({ search: "", operators: new Set(), time: "" })
            }
          />

          <section>
            <div className="space-y-4">
              {results.map((r) => (
                <ResultCard key={r.id} item={r} onSelect={onSelectTrip} />
              ))}

              {results.length === 0 && (
                <div className="p-6 border rounded text-center">
                  Sefer bulunamadı.
                </div>
              )}
            </div>
            {bookingOpen && (
              <React.Suspense>
                <BookingModal
                  open={bookingOpen}
                  trip={selectedTrip}
                  onClose={() => setBookingOpen(false)}
                  onConfirm={onConfirmBooking}
                />
              </React.Suspense>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
