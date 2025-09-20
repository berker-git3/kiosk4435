import React, { useMemo, useState } from "react";
import VoucherModal from "@/components/otobus/VoucherModal";

const demoCars = [
  {
    id: "volvo-xc90",
    title: "Volvo XC90",
    category: "Lüks",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F7820820f1399453eba69cd6e0c2a27e0%2Fed62503c92894c1886b8001d11492e85?format=webp&width=800",
    price: 60669.4,
    officePrice: 86444.4,
    features: [
      "Dizel",
      "Otomatik",
      "13.000 TL Depozito",
      "7 Koltuk",
      "Bagaj 2500 L",
    ],
  },
  {
    id: "reno-traffic",
    title: "Renault Traffic",
    category: "Minivan",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F7820820f1399453eba69cd6e0c2a27e0%2F7ce54faf522a4ba1829535efa415b1d6?format=webp&width=800",
    price: 45999.0,
    officePrice: 65999.0,
    features: ["Dizel", "Manuel", "5 Koltuk", "Yük Kapasitesi"],
  },
];

export default function AracKiralama() {
  const bg =
    "https://cdn.builder.io/api/v1/image/assets%2F7820820f1399453eba69cd6e0c2a27e0%2Fed62503c92894c1886b8001d11492e85?format=webp&width=1600";

  const [step, setStep] = useState<number>(1); // 1: search, 2: list, 3: packages, 4: extras, 5: payment
  const [query, setQuery] = useState<any>({
    pickup: "Antalya Havalimanı",
    return: "Antalya Havalimanı",
    pickupDate: "",
    pickupTime: "19:00",
    returnDate: "",
    returnTime: "19:00",
  });
  const [cars] = useState(demoCars);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selectedCar, setSelectedCar] = useState<any | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [extras, setExtras] = useState<Record<string, number>>({
    childSeat: 0,
    extraDriver: 0,
  });
  const [passengerInfo, setPassengerInfo] = useState<any>({
    name: "",
    surname: "",
    tc: "",
    license: "",
    dob: "",
    city: "",
    district: "",
    address: "",
    phone: "",
    email: "",
  });
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [reservation, setReservation] = useState<any | null>(null);

  const packages = useMemo(
    () => [
      {
        id: "basic",
        title: "Orta Güvence Paketi",
        price: 2550,
        features: ["Lastik, Cam, Far", "Mini Hasar", "İhtiyari Mali"],
      },
      {
        id: "full",
        title: "Full Güvence Paketi",
        price: 3006,
        features: ["Lastik, Cam, Far", "Süper Mini Hasar", "Ferdi Kaza"],
      },
      {
        id: "premium",
        title: "Premium Güvence Paketi",
        price: 3750,
        features: ["Premium Hasar", "Ferdi Kaza", "İhtiyari Mali"],
      },
    ],
    [],
  );

  const onSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFeatures = (id: string) =>
    setExpanded((s) => ({ ...s, [id]: !s[id] }));

  const selectCar = (car: any) => {
    setSelectedCar(car);
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectPackage = (pkgId: string) => {
    setSelectedPackage(pkgId);
    setStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateExtra = (key: string, delta: number) =>
    setExtras((s) => ({ ...s, [key]: Math.max(0, (s[key] || 0) + delta) }));

  const proceedToPayment = () => {
    setStep(5);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePayment = (e?: React.FormEvent) => {
    e?.preventDefault();
    // simulate payment success
    const code = Math.random()
      .toString(36)
      .toUpperCase()
      .slice(2, 10)
      .replace(/[^A-Z0-9]/g, "0")
      .slice(0, 8);
    const booking = {
      code,
      trip: {
        operator: selectedCar?.title || "Araç Kiralama",
        depart: query.pickup,
        arrive: query.return,
        date: query.pickupDate,
        time: query.pickupTime,
        duration: "Tahmini 5 saat",
        busPlate: selectedCar?.id,
        capacity: selectedCar?.category,
        driver: "-",
        price: selectedCar?.price || 0,
      },
      seats: [],
      passengers: [
        {
          ...passengerInfo,
          extras: Object.entries(extras)
            .filter(([, v]) => v > 0)
            .map(([k, v]) => `${k} x${v}`),
        },
      ],
      payment: { method: "card", amount: selectedCar?.price || 0 },
      createdAt: new Date().toISOString(),
    };
    setReservation(booking);
    setVoucherOpen(true);
  };

  return (
    <main className="w-full">
      <section
        className="w-full bg-center bg-cover flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.35)), url('${bg}')`,
          minHeight: "420px",
        }}
      >
        <div className="max-w-6xl w-full px-6 py-20">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 md:p-10 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="md:flex-1">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                  Ayrıcalıklı bir araç kiralama deneyimi
                </h1>
                <p className="mt-2 text-sm md:text-base text-slate-200/90">
                  Konforlu araçlar, güvenilir hizmet. Rezervasyonunuzu hızlıca
                  yapın.
                </p>
              </div>

              <form
                onSubmit={onSearch}
                className="w-full md:w-[560px] bg-white/95 rounded-lg p-3 md:p-4 lg:p-6 text-slate-900 shadow-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label className="text-xs text-slate-600 mb-1">
                      Alış Ofisi
                    </label>
                    <input
                      aria-label="Alış Ofisi"
                      value={query.pickup}
                      onChange={(e) =>
                        setQuery((q) => ({ ...q, pickup: e.target.value }))
                      }
                      placeholder="Alış Ofisi Seçiniz"
                      className="rounded-md px-3 py-2 border"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-slate-600 mb-1">
                      İade Ofisi
                    </label>
                    <input
                      aria-label="İade Ofisi"
                      value={query.return}
                      onChange={(e) =>
                        setQuery((q) => ({ ...q, return: e.target.value }))
                      }
                      placeholder="İade Ofisi"
                      className="rounded-md px-3 py-2 border"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-slate-600 mb-1">
                      Alış Tarih / Saat
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        aria-label="Alış Tarihi"
                        value={query.pickupDate}
                        onChange={(e) =>
                          setQuery((q) => ({
                            ...q,
                            pickupDate: e.target.value,
                          }))
                        }
                        className="rounded-md px-3 py-2 border w-1/2"
                      />
                      <input
                        type="time"
                        aria-label="Alış Saati"
                        value={query.pickupTime}
                        onChange={(e) =>
                          setQuery((q) => ({
                            ...q,
                            pickupTime: e.target.value,
                          }))
                        }
                        className="rounded-md px-3 py-2 border w-1/2"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-xs text-slate-600 mb-1">
                      İade Tarih / Saat
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        aria-label="İade Tarihi"
                        value={query.returnDate}
                        onChange={(e) =>
                          setQuery((q) => ({
                            ...q,
                            returnDate: e.target.value,
                          }))
                        }
                        className="rounded-md px-3 py-2 border w-1/2"
                      />
                      <input
                        type="time"
                        aria-label="İade Saati"
                        value={query.returnTime}
                        onChange={(e) =>
                          setQuery((q) => ({
                            ...q,
                            returnTime: e.target.value,
                          }))
                        }
                        className="rounded-md px-3 py-2 border w-1/2"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="text-sm text-slate-600">
                    Kampanyalı Fiyatlar · Kolay İptal
                  </div>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white rounded-md px-5 py-2"
                  >
                    Araçları Görüntüle
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Step indicator */}
        <div className="flex items-center gap-3 text-sm text-slate-600 mb-6">
          <div
            className={`px-3 py-1 rounded-full ${step >= 1 ? "bg-green-100 text-green-800" : "bg-slate-100"}`}
          >
            1
          </div>
          <div>Arama</div>
          <div
            className={`px-3 py-1 rounded-full ${step >= 2 ? "bg-green-100 text-green-800" : "bg-slate-100"}`}
          >
            2
          </div>
          <div>Araçlar</div>
          <div
            className={`px-3 py-1 rounded-full ${step >= 3 ? "bg-green-100 text-green-800" : "bg-slate-100"}`}
          >
            3
          </div>
          <div>Güvence Paketleri</div>
          <div
            className={`px-3 py-1 rounded-full ${step >= 4 ? "bg-green-100 text-green-800" : "bg-slate-100"}`}
          >
            4
          </div>
          <div>Ek Ürünler</div>
          <div
            className={`px-3 py-1 rounded-full ${step >= 5 ? "bg-green-100 text-green-800" : "bg-slate-100"}`}
          >
            5
          </div>
          <div>Ödeme</div>
        </div>

        {/* Step 2: Car listing */}
        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cars.map((car: any) => (
              <div key={car.id} className="border rounded-lg p-4 flex gap-4">
                <img
                  src={car.image}
                  alt={car.title}
                  className="w-48 h-36 object-cover rounded"
                />
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-slate-500">
                        {car.category}
                      </div>
                      <h3 className="font-semibold text-lg">{car.title}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500">Liste Fiyatı</div>
                      <div className="font-semibold text-lg">
                        {car.officePrice.toLocaleString("tr-TR")} TL
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-4">
                    <div className="text-sm text-slate-600">
                      Kiralama koşulları kısa açıklama
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFeatures(car.id)}
                        className="text-sm underline"
                      >
                        Tüm özellikleri göster
                      </button>
                      <button
                        onClick={() => selectCar(car)}
                        className="bg-red-600 text-white px-4 py-2 rounded"
                      >
                        Seç
                      </button>
                    </div>
                  </div>

                  <div
                    className={`mt-3 overflow-hidden transition-[max-height] duration-300 ${expanded[car.id] ? "max-h-80" : "max-h-0"}`}
                  >
                    <ul className="text-sm text-slate-700 bg-slate-50 p-3 rounded">
                      {car.features.map((f: string, i: number) => (
                        <li key={i}>• {f}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <button className="px-4 py-2 border rounded">
                      Ofiste Ödeme
                      <br />
                      <span className="font-semibold">
                        {car.officePrice.toLocaleString("tr-TR")} TL
                      </span>
                    </button>
                    <button className="px-4 py-2 bg-black text-white rounded">
                      Hemen Öde
                      <br />
                      <span className="font-semibold">
                        {car.price.toLocaleString("tr-TR")} TL
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 3: Packages */}
        {step === 3 && selectedCar && (
          <div>
            <h3 className="font-semibold text-xl mb-4">
              Güvence Paketleri - {selectedCar.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((p: any) => (
                <div key={p.id} className="p-4 border rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-500">{p.title}</div>
                      <div className="font-semibold">
                        {p.price.toLocaleString("tr-TR")} TL
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => selectPackage(p.id)}
                        className="bg-red-600 text-white px-3 py-2 rounded"
                      >
                        PAKETİ EKLE
                      </button>
                    </div>
                  </div>

                  <ul className="mt-3 text-sm text-slate-600">
                    {p.features.map((f: string, i: number) => (
                      <li key={i} className="py-1">
                        ✔ {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Extras */}
        {step === 4 && (
          <div>
            <h3 className="font-semibold text-xl mb-4">Ek Ürünler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold">Ek Sürücü</div>
                  <div className="text-sm text-slate-600">
                    Araç için ekstra sürücü ekleyin
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateExtra("extraDriver", -1)}
                    className="px-2 py-1 border rounded"
                  >
                    -
                  </button>
                  <div className="px-3">{extras.extraDriver || 0}</div>
                  <button
                    onClick={() => updateExtra("extraDriver", 1)}
                    className="px-2 py-1 border rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-4 border rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold">Çocuk Koltuğu</div>
                  <div className="text-sm text-slate-600">
                    Bebek/Çocuk için uygun koltuk
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateExtra("childSeat", -1)}
                    className="px-2 py-1 border rounded"
                  >
                    -
                  </button>
                  <div className="px-3">{extras.childSeat || 0}</div>
                  <button
                    onClick={() => updateExtra("childSeat", 1)}
                    className="px-2 py-1 border rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 border rounded"
              >
                Geri
              </button>
              <button
                onClick={proceedToPayment}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                SONRAKİ ADIM
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Payment / passenger info */}
        {step === 5 && (
          <div>
            <h3 className="font-semibold text-xl mb-4">Ödeme Bilgileri</h3>
            <form
              onSubmit={handlePayment}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="p-4 border rounded">
                <h4 className="font-semibold mb-3">Sürücü Bilgileri</h4>
                <div className="grid grid-cols-1 gap-3">
                  <input
                    placeholder="Ad"
                    value={passengerInfo.name}
                    onChange={(e) =>
                      setPassengerInfo((p) => ({ ...p, name: e.target.value }))
                    }
                    className="rounded-md px-3 py-2 border"
                  />
                  <input
                    placeholder="Soyad"
                    value={passengerInfo.surname}
                    onChange={(e) =>
                      setPassengerInfo((p) => ({
                        ...p,
                        surname: e.target.value,
                      }))
                    }
                    className="rounded-md px-3 py-2 border"
                  />
                  <input
                    placeholder="TC No"
                    value={passengerInfo.tc}
                    onChange={(e) =>
                      setPassengerInfo((p) => ({ ...p, tc: e.target.value }))
                    }
                    className="rounded-md px-3 py-2 border"
                  />
                  <input
                    placeholder="Ehliyet No"
                    value={passengerInfo.license}
                    onChange={(e) =>
                      setPassengerInfo((p) => ({
                        ...p,
                        license: e.target.value,
                      }))
                    }
                    className="rounded-md px-3 py-2 border"
                  />
                  <input
                    type="date"
                    placeholder="Doğum Tarihi"
                    value={passengerInfo.dob}
                    onChange={(e) =>
                      setPassengerInfo((p) => ({ ...p, dob: e.target.value }))
                    }
                    className="rounded-md px-3 py-2 border"
                  />
                </div>
              </div>

              <div className="p-4 border rounded">
                <h4 className="font-semibold mb-3">Ödeme / Kart Bilgileri</h4>
                <div className="grid grid-cols-1 gap-3">
                  <input
                    placeholder="Kart üzerindeki isim"
                    className="rounded-md px-3 py-2 border"
                  />
                  <input
                    placeholder="Kart numarası"
                    className="rounded-md px-3 py-2 border"
                  />
                  <div className="flex gap-2">
                    <input
                      placeholder="MM/YY"
                      className="rounded-md px-3 py-2 border w-1/2"
                    />
                    <input
                      placeholder="CVC"
                      className="rounded-md px-3 py-2 border w-1/2"
                    />
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    Toplam: {selectedCar?.price?.toLocaleString("tr-TR") || 0}{" "}
                    TL
                  </div>
                  <button
                    type="submit"
                    className="mt-3 bg-black text-white rounded px-4 py-2"
                  >
                    ÖDEME Yap
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(4)}
                className="px-4 py-2 border rounded"
              >
                Geri
              </button>
            </div>
          </div>
        )}
      </div>

      <VoucherModal
        open={voucherOpen}
        reservation={reservation}
        onClose={() => {
          setVoucherOpen(false);
          setStep(1);
        }}
      />
    </main>
  );
}
