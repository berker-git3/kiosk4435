import React from "react";

export default function AracKiralama() {
  const bg = "https://cdn.builder.io/api/v1/image/assets%2F7820820f1399453eba69cd6e0c2a27e0%2Fed62503c92894c1886b8001d11492e85?format=webp&width=1600";

  return (
    <main className="w-full">
      <section
        className="w-full bg-center bg-cover flex items-center justify-center"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('${bg}')`, minHeight: '420px' }}
      >
        <div className="max-w-6xl w-full px-6 py-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 md:p-10 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Ayrıcalıklı bir araç kiralama deneyimi</h1>
            <p className="text-sm md:text-base text-slate-200/90 mb-6">Konforlu araçlar, güvenilir hizmet. Rezervasyonunuzu hızlıca yapın.</p>

            <form className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input placeholder="Alış Ofisi Seçiniz" className="rounded-md px-3 py-3 bg-white/90 text-slate-900" />
                <input placeholder="İade Ofisi" className="rounded-md px-3 py-3 bg-white/90 text-slate-900" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" className="rounded-md px-3 py-3 bg-white/90 text-slate-900" />
                  <input type="time" className="rounded-md px-3 py-3 bg-white/90 text-slate-900" />
                </div>
              </div>

              <div className="flex items-center gap-3 justify-end">
                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white rounded-md px-6 py-3">2 GÜN KİRALA</button>
              </div>
            </form>
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
