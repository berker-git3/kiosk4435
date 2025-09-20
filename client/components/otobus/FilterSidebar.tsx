import React from "react";

export default function FilterSidebar({ value, onChange, onReset, operators, onToggleOperator }: any) {
  return (
    <aside className="w-full md:w-72 lg:w-80 bg-white border rounded-xl p-4 md:sticky md:top-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Filtreler</h3>
        {onReset && (
          <button onClick={onReset} className="text-xs text-slate-500 hover:text-slate-800">Sıfırla</button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Hızlı Filtreler</label>
          <div className="grid grid-cols-1 gap-2">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-red-600" /> Yalnızca e-bilet</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-red-600" /> Yalnızca doğrudan</label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Kalkış Saati</label>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <label className="flex items-center justify-between"><span><input type="checkbox" className="accent-red-600 mr-2" /> Erken (06:00 - 11:00)</span><span className="text-slate-500">3</span></label>
            <label className="flex items-center justify-between"><span><input type="checkbox" className="accent-red-600 mr-2" /> Öğlen (11:00 - 17:00)</span><span className="text-slate-500">1</span></label>
            <label className="flex items-center justify-between"><span><input type="checkbox" className="accent-red-600 mr-2" /> Gece (17:00+)</span><span className="text-slate-500">0</span></label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">İşletmeciler</label>
          <div className="grid grid-cols-1 gap-2">
            {(operators || []).map((op: any) => (
              <label key={op.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <input type="checkbox" checked={op.checked} onChange={() => onToggleOperator && onToggleOperator(op.name)} className="accent-red-600" /> {op.name}
                </span>
                <span className="text-slate-500">{op.count}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <button onClick={onReset} className="w-full mt-3 rounded-md bg-red-600 text-white py-2 text-sm font-semibold">Filtreleri Uygula</button>
        </div>
      </div>
    </aside>
  );
}
