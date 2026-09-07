// src/components/HealthCard.jsx
import React from "react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { RECOMMENDED_FOODS, AVOID_FOODS } from "../data/foodDatabase.js";

export default function HealthCard({ profile }) {
  return (
    <>
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-stone-800 mb-3">Đánh giá sức khoẻ tổng quan</h2>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="min-w-0">
            <div className="text-2xl font-bold text-stone-800">{profile.bmi}</div>
            <div className="text-xs text-stone-500 break-words">BMI — {profile.bmiLabel}</div>
            <div className="text-[11px] text-stone-400 mt-1 break-words">Chỉ số khối cơ thể = Cân nặng / Chiều cao². Ước tính mức cân đối chung, chưa phân biệt cơ và mỡ.</div>
          </div>
          <div className="min-w-0">
            <div className={`text-2xl font-bold ${profile.highRisk ? "text-red-600" : "text-emerald-700"}`}>{profile.whtr}</div>
            <div className="text-xs text-stone-500 break-words">Tỷ lệ Eo/Cao (WHtR)</div>
            <div className="text-[11px] text-stone-400 mt-1 break-words">= Vòng eo / Chiều cao. Từ 0,5 trở lên là ngưỡng cần lưu ý về mỡ vùng bụng.</div>
          </div>
        </div>
        {profile.highRisk ? (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span>
              WHtR ≥ 0,5 — chỉ số tham khảo cho thấy nguy cơ béo bụng và tích tụ mỡ nội tạng cao hơn.
              Đây không phải chẩn đoán y khoa; nếu lo ngại, hãy trao đổi thêm với bác sĩ/chuyên gia dinh dưỡng.
            </span>
          </div>
        ) : (
          <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-700">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <span>WHtR dưới 0,5 — đang trong ngưỡng tham khảo an toàn về phân bổ mỡ vùng bụng.</span>
          </div>
        )}
      </div>

      {profile.highRisk && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-stone-800 mb-3">Khuyến nghị thực phẩm</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mb-2">
                <CheckCircle2 size={14} /> NÊN ĂN
              </div>
              <ul className="space-y-1.5">
                {RECOMMENDED_FOODS.map((f, i) => (
                  <li key={i} className="text-xs text-stone-600">
                    <span className="font-medium text-stone-800">{f.name}</span> — {f.reason}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600 mb-2">
                <XCircle size={14} /> CẦN TRÁNH
              </div>
              <ul className="space-y-1.5">
                {AVOID_FOODS.map((f, i) => (
                  <li key={i} className="text-xs text-stone-600">
                    <span className="font-medium text-stone-800">{f.name}</span> — {f.reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="text-[11px] text-stone-400 mt-3 pt-3 border-t border-stone-100">
            Đã tự động điều chỉnh tỷ lệ Macro thành 35% Protein · 35% Carb · 30% Fat để hỗ trợ giảm mỡ nội tạng.
          </div>
        </div>
      )}
    </>
  );
}
