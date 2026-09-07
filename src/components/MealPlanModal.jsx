// src/components/MealPlanModal.jsx
import React from "react";
import { X } from "lucide-react";
import { MEAL_META } from "../data/constants.js";
import { fmt } from "../utils/nutritionMath.js";

export default function MealPlanModal({ plan, target, highRisk, onClose, onApply }) {
  return (
    <div className="fixed inset-0 bg-stone-900/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h3 className="text-sm font-semibold text-stone-800">Thực đơn gợi ý hôm nay</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600"><X size={18} /></button>
        </div>
        <div className="overflow-y-auto px-5 py-4 flex-1 space-y-4">
          <p className="text-xs text-stone-500">
            Đã tính toán theo mục tiêu {fmt(target)} kcal/ngày{highRisk ? " và ưu tiên nhóm thực phẩm hỗ trợ giảm mỡ nội tạng." : "."}
          </p>
          {MEAL_META.map((meal) => {
            const items = plan[meal.key] || [];
            const mealKcal = items.reduce((s, i) => s + i.kcal, 0);
            return (
              <div key={meal.key} className="border border-stone-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-stone-800">{meal.label}</span>
                  <span className="text-xs text-stone-400">{fmt(mealKcal)} kcal</span>
                </div>
                <ul className="text-xs text-stone-600 space-y-0.5">
                  {items.map((it, i) => (<li key={i}>{it.name} — {it.grams}g ({fmt(it.kcal)} kcal)</li>))}
                </ul>
              </div>
            );
          })}
        </div>
        <div className="px-5 py-4 border-t border-stone-100">
          <button onClick={onApply} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm">
            Áp dụng thực đơn này vào nhật ký
          </button>
        </div>
      </div>
    </div>
  );
}
