// src/components/MacroDashboard.jsx
import React from "react";
import { Beef, Wheat, Droplet } from "lucide-react";
import { fmt } from "../utils/nutritionMath.js";

export default function MacroDashboard({ profile, totals }) {
  const kcalPct = Math.min(100, (totals.kcal / profile.target) * 100);
  const overBudget = totals.kcal > profile.target;

  const macroRows = [
    { key: "protein", label: "Protein", icon: Beef, current: totals.protein, target: profile.proteinG, color: "bg-emerald-600" },
    { key: "carb", label: "Carbs", icon: Wheat, current: totals.carb, target: profile.carbG, color: "bg-amber-500" },
    { key: "fat", label: "Fat", icon: Droplet, current: totals.fat, target: profile.fatG, color: "bg-sky-500" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex items-center gap-4 shrink-0 min-w-0">
          <svg width="96" height="96" viewBox="0 0 96 96" className="shrink-0">
            <circle cx="48" cy="48" r="42" fill="none" stroke="#E7E5E4" strokeWidth="10" />
            <circle
              cx="48" cy="48" r="42" fill="none"
              stroke={overBudget ? "#EF4444" : "#059669"} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 42}
              strokeDashoffset={2 * Math.PI * 42 * (1 - kcalPct / 100)}
              transform="rotate(-90 48 48)"
            />
          </svg>
          <div className="min-w-0">
            <div className={`text-2xl font-bold break-words ${overBudget ? "text-red-600" : "text-emerald-700"}`}>{fmt(totals.kcal)}</div>
            <div className="text-xs text-stone-500 break-words">/ {fmt(profile.target)} kcal mục tiêu</div>
            {overBudget && <div className="text-xs font-medium text-red-600 mt-0.5 break-words">Vượt {fmt(totals.kcal - profile.target)} kcal</div>}
            <div className="text-[11px] text-stone-400 mt-1 max-w-[180px] break-words">Vòng tròn thể hiện % Calo đã nạp so với mục tiêu hôm nay — đầy xanh là vừa đủ, chuyển đỏ là đã vượt.</div>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 gap-3 min-w-0">
          {macroRows.map((m) => {
            const Icon = m.icon;
            const pct = Math.min(100, (m.current / m.target) * 100);
            const over = m.current > m.target;
            return (
              <div key={m.key}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 font-medium text-stone-600"><Icon size={13} /> {m.label}</span>
                  <span className={over ? "text-red-600 font-medium" : "text-stone-500"}>{fmt(m.current)}g / {fmt(m.target)}g</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${over ? "bg-red-500" : m.color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5 pt-4 border-t border-stone-100 text-center">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-stone-800">{profile.bmr}</div>
          <div className="text-[11px] text-stone-500">BMR (kcal)</div>
          <div className="text-[9px] sm:text-[10px] text-stone-400 mt-0.5 break-words leading-tight">Năng lượng cần khi nghỉ</div>
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-stone-800">{profile.tdee}</div>
          <div className="text-[11px] text-stone-500">TDEE (kcal)</div>
          <div className="text-[9px] sm:text-[10px] text-stone-400 mt-0.5 break-words leading-tight">Tổng năng lượng cả ngày</div>
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-stone-800">{profile.pal}</div>
          <div className="text-[11px] text-stone-500">Hệ số PAL</div>
          <div className="text-[9px] sm:text-[10px] text-stone-400 mt-0.5 break-words leading-tight">Mức vận động đã chọn</div>
        </div>
      </div>
    </div>
  );
}
