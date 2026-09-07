// src/components/TipCard.jsx
import React from "react";
import { RefreshCw, Sparkles } from "lucide-react";

export default function TipCard({ tip, onShuffle }) {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles size={14} className="text-white" />
      </div>
      <div className="flex-1">
        <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-0.5">
          Lời khuyên từ Huấn luyện viên AI
        </div>
        <div className="text-sm text-emerald-900">{tip}</div>
      </div>
      <button onClick={onShuffle} className="text-emerald-600 hover:text-emerald-800 shrink-0" title="Đổi lời khuyên khác">
        <RefreshCw size={16} />
      </button>
    </div>
  );
}
