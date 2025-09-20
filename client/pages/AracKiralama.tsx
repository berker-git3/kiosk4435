import React from "react";

export default function AracKiralama() {
  const bg = "https://cdn.builder.io/api/v1/image/assets%2F7820820f1399453eba69cd6e0c2a27e0%2Fed62503c92894c1886b8001d11492e85?format=webp&width=1600";

  return (
    <main className="w-full">
      <section
        className="w-full bg-center bg-cover flex items-center justify-center"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.35)), url('${bg}')`, minHeight: '520px' }}
      >
        <div className="w-full">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 md:p-6 lg:p-10 mt-12 md:mt-20 text-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="md:flex-1">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">Ayrıcalıklı bir araç kiralama deneyimi</h1>
                  <p className="mt-2 text-sm md:text-base text-slate-200/90">Konforlu araçlar, güvenilir hizmet. Rezervasyonunuzu hızlıca yapın.</p>
                </div>

                <form className="w-full md:w-[560px] bg-white/95 rounded-lg p-3 md:p-4 lg:p-6 text-slate-900 shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <label className="text-xs text-slate-600 mb-1">Alış Ofisi</label>
                      <input aria-label="Alış Ofisi" placeholder="Alış Ofisi Seçiniz" className="rounded-md px-3 py-2 border" />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-slate-600 mb-1">İade Ofisi</label>
                      <input aria-label="İade Ofisi" placeholder="İade Ofisi" className="rounded-md px-3 py-2 border" />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-slate-600 mb-1">Alış Tarih / Saat</label>
                      <div className="flex gap-2">
                        <input type="date" aria-label="Alış Tarihi" className="rounded-md px-3 py-2 border w-1/2" />
                        <input type="time" aria-label="Alış Saati" className="rounded-md px-3 py-2 border w-1/2" />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs text-slate-600 mb-1">İade Tarih / Saat</label>
                      <div className="flex gap-2">
                        <input type="date" aria-label="İade Tarihi" className="rounded-md px-3 py-2 border w-1/2" />
                        <input type="time" aria-label="İade Saati" className="rounded-md px-3 py-2 border w-1/2" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="text-sm text-slate-600">Kampanyalı Fiyatlar · Kolay İptal</div>
                    <button type="submit" className="bg-red-600 hover:bg-red-700 text-white rounded-md px-5 py-2">2 GÜN KİRALA</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-xl font-semibold mb-4">Popüler Araçlar</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border rounded">Araç 1</div>
          <div className="p-4 border rounded">Araç 2</div>
          <div className="p-4 border rounded">Araç 3</div>
        </div>
      </section>
    </main>
  );
}
