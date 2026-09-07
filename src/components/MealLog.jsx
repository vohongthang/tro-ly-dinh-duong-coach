// src/components/MealLog.jsx
import React from "react";
import { Plus, Trash2, AlertTriangle } from "lucide-react";
import { MEAL_META } from "../data/constants.js";
import { fmt } from "../utils/nutritionMath.js";

export default function MealLog({ meals, highRisk, onOpenModal, onRemoveFood }) {
  return (
    <div className="space-y-4">
      {MEAL_META.map((meal) => {
        const items = meals[meal.key] || [];
        const mealKcal = items.reduce((s, i) => s + i.kcal, 0);
        return (
          <div key={meal.key} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold text-stone-800">{meal.label}</h2>
                <div className="text-xs text-stone-400">{fmt(mealKcal)} kcal</div>
              </div>
              <button onClick={() => onOpenModal(meal.key)} className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full">
                <Plus size={14} /> Thêm món
              </button>
            </div>
            {items.length === 0 ? (
              <div className="text-xs text-stone-400 py-2">Chưa có món nào</div>
            ) : (
              <div className="space-y-1.5">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm bg-stone-50 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      {item.caution && highRisk && <AlertTriangle size={13} className="text-amber-500 shrink-0" />}
                      <span>
                        <span className="font-medium text-stone-700">{item.name}</span>
                        <span className="text-stone-400 text-xs ml-1.5">{item.grams}g</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-stone-500">{fmt(item.kcal)} kcal</span>
                      <button onClick={() => onRemoveFood(meal.key, item.id)} className="text-stone-300 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
