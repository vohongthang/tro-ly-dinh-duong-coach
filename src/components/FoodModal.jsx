// src/components/FoodModal.jsx
import React, { useState } from "react";
import { X, Search, PlusCircle, ChevronLeft, AlertTriangle } from "lucide-react";
import { MEAL_META } from "../data/constants.js";
import { fmt } from "../utils/nutritionMath.js";

export default function FoodModal({ mealKey, allFoods, highRisk, onClose, onConfirmAdd, onSaveCustomFood }) {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedFood, setSelectedFood] = useState(null);
  const [grams, setGrams] = useState("");
  const [addingCustom, setAddingCustom] = useState(false);
  const [customForm, setCustomForm] = useState({ name: "", kcal: "", protein: "", carb: "", fat: "" });

  const filteredFoods = allFoods.filter((f) => {
    const matchName = f.name.toLowerCase().includes(search.toLowerCase());
    const matchSource = sourceFilter === "all" || f.source === sourceFilter;
    return matchName && matchSource;
  });

  function handleSaveCustom() {
    const { name, kcal, protein, carb, fat } = customForm;
    if (!name || !kcal) return;
    const food = {
      id: "custom-" + Date.now(),
      name, source: "Tự thêm",
      kcal: parseFloat(kcal) || 0,
      protein: parseFloat(protein) || 0,
      carb: parseFloat(carb) || 0,
      fat: parseFloat(fat) || 0,
    };
    onSaveCustomFood(food);
    setSelectedFood(food);
    setAddingCustom(false);
  }

  function handleConfirm() {
    const g = parseFloat(grams);
    if (!selectedFood || !g || g <= 0) return;
    onConfirmAdd(mealKey, selectedFood, g);
  }

  const mealLabel = MEAL_META.find((m) => m.key === mealKey)?.label || "";

  return (
    <div className="fixed inset-0 bg-stone-900/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h3 className="text-sm font-semibold text-stone-800">
            {selectedFood ? "Nhập khối lượng" : addingCustom ? "Tự thêm món mới" : `Thêm món — ${mealLabel}`}
          </h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600"><X size={18} /></button>
        </div>

        {addingCustom ? (
          <div className="px-5 py-5 flex-1 space-y-3">
            <input type="text" placeholder="Tên món ăn" value={customForm.name}
              onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
              className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" placeholder="Kcal/100g" value={customForm.kcal} onChange={(e) => setCustomForm({ ...customForm, kcal: e.target.value })} className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <input type="number" placeholder="Protein (g)" value={customForm.protein} onChange={(e) => setCustomForm({ ...customForm, protein: e.target.value })} className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <input type="number" placeholder="Carb (g)" value={customForm.carb} onChange={(e) => setCustomForm({ ...customForm, carb: e.target.value })} className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <input type="number" placeholder="Fat (g)" value={customForm.fat} onChange={(e) => setCustomForm({ ...customForm, fat: e.target.value })} className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <p className="text-[11px] text-stone-400">Số liệu tính theo 100g thực phẩm. Món này sẽ được lưu lại để dùng cho lần sau.</p>
            <button onClick={handleSaveCustom} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm">
              Lưu &amp; chọn món này
            </button>
          </div>
        ) : !selectedFood ? (
          <>
            <div className="px-5 pt-3 pb-2 space-y-2">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm thực phẩm..."
                  className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="flex items-center gap-2">
                {["all", "NIN", "USDA"].map((s) => (
                  <button key={s} onClick={() => setSourceFilter(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border ${sourceFilter === s ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-stone-500 border-stone-300"}`}>
                    {s === "all" ? "Tất cả" : s === "NIN" ? "Viện Dinh dưỡng" : "USDA"}
                  </button>
                ))}
                <button onClick={() => setAddingCustom(true)} className="ml-auto flex items-center gap-1 text-xs font-medium text-emerald-700">
                  <PlusCircle size={14} /> Tự thêm món
                </button>
              </div>
            </div>
            <div className="overflow-y-auto px-3 pb-4 flex-1">
              {filteredFoods.length === 0 && <div className="text-center text-sm text-stone-400 py-8">Không tìm thấy thực phẩm</div>}
              {filteredFoods.map((f) => (
                <button key={f.id} onClick={() => setSelectedFood(f)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-emerald-50 text-left">
                  <div>
                    <div className="text-sm font-medium text-stone-800 flex items-center gap-1.5">
                      {f.name}
                      {f.caution && highRisk && <AlertTriangle size={12} className="text-amber-500" />}
                    </div>
                    <div className="text-[11px] text-stone-400">{f.kcal} kcal · {f.protein}g P · {f.carb}g C · {f.fat}g F (/100g)</div>
                  </div>
                  <span className="text-[10px] font-medium text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full shrink-0 ml-2">{f.source}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="px-5 py-5 flex-1">
            <button onClick={() => setSelectedFood(null)} className="flex items-center gap-1 text-xs text-stone-500 mb-4">
              <ChevronLeft size={14} /> Chọn món khác
            </button>
            <div className="text-sm font-semibold text-stone-800 mb-1 flex items-center gap-1.5">
              {selectedFood.name}
              {selectedFood.caution && highRisk && <AlertTriangle size={13} className="text-amber-500" />}
            </div>
            <div className="text-xs text-stone-400 mb-4">{selectedFood.kcal} kcal / 100g · Nguồn: {selectedFood.source}</div>
            {selectedFood.caution && highRisk && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-700 mb-4">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span>Món này thuộc nhóm nên hạn chế khi có nguy cơ mỡ nội tạng cao — vẫn có thể ăn với khẩu phần vừa phải.</span>
              </div>
            )}
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Khối lượng (gram)</label>
            <input type="number" autoFocus value={grams} onChange={(e) => setGrams(e.target.value)} placeholder="VD: 150"
              className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4" />
            {grams && parseFloat(grams) > 0 && (
              <div className="bg-emerald-50 rounded-lg p-3 text-xs text-emerald-800 mb-4 grid grid-cols-4 gap-2 text-center">
                <div><div className="font-semibold">{fmt((selectedFood.kcal * grams) / 100)}</div><div className="text-[10px]">kcal</div></div>
                <div><div className="font-semibold">{fmt((selectedFood.protein * grams) / 100)}g</div><div className="text-[10px]">Protein</div></div>
                <div><div className="font-semibold">{fmt((selectedFood.carb * grams) / 100)}g</div><div className="text-[10px]">Carb</div></div>
                <div><div className="font-semibold">{fmt((selectedFood.fat * grams) / 100)}g</div><div className="text-[10px]">Fat</div></div>
              </div>
            )}
            <button onClick={handleConfirm} disabled={!grams || parseFloat(grams) <= 0}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-semibold rounded-lg text-sm">
              Thêm vào {mealLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
