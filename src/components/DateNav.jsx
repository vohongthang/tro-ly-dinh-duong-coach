// src/components/DateNav.jsx
import React from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { addDays, todayStr } from "../utils/storage.js";

export default function DateNav({ selectedDate, onChange }) {
  const isToday = selectedDate === todayStr();

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-3 flex items-center gap-2">
      <button onClick={() => onChange(addDays(selectedDate, -1))} className="w-9 h-9 shrink-0 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-500">
        <ChevronLeft size={18} />
      </button>

      <div className="flex-1 flex items-center gap-2 justify-center min-w-0">
        <CalendarDays size={15} className="text-stone-400 shrink-0" />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onChange(e.target.value)}
          className="text-sm font-medium text-stone-700 bg-transparent focus:outline-none w-full min-w-0 max-w-[160px]"
        />
      </div>

      <button onClick={() => onChange(addDays(selectedDate, 1))} className="w-9 h-9 shrink-0 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-500">
        <ChevronRight size={18} />
      </button>

      {!isToday && (
        <button onClick={() => onChange(todayStr())} className="ml-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full shrink-0 whitespace-nowrap">
          Hôm nay
        </button>
      )}
    </div>
  );
}
