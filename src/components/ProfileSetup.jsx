// src/components/ProfileSetup.jsx
import React, { useState } from "react";
import { Flame } from "lucide-react";
import { PAL_OPTIONS, GOAL_OPTIONS } from "../data/constants.js";

export default function ProfileSetup({ onSubmit, initialForm }) {
  const [form, setForm] = useState(
    initialForm || { name: "", age: "", gender: "nam", height: "", weight: "", waist: "", goal: "giu", pal: 1.55 }
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.age || !form.height || !form.weight || !form.waist) return;
    onSubmit(form);
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm my-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center">
            <Flame size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-emerald-900">Trợ lý Dinh dưỡng Thông minh</h1>
        </div>
        <p className="text-sm text-stone-500 mb-6">
          Nhập thông tin để đánh giá sức khoẻ tổng quan và tính Calo/Macro cá nhân hoá. Dữ liệu chỉ lưu trên máy bạn (LocalStorage).
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Tên</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="VD: Thắng" className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Tuổi</label>
            <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="30"
              className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Giới tính</label>
            <div className="flex rounded-lg overflow-hidden border border-stone-300">
              <button type="button" onClick={() => setForm({ ...form, gender: "nam" })}
                className={`flex-1 py-2.5 text-sm font-medium ${form.gender === "nam" ? "bg-emerald-600 text-white" : "bg-white text-stone-600"}`}>Nam</button>
              <button type="button" onClick={() => setForm({ ...form, gender: "nu" })}
                className={`flex-1 py-2.5 text-sm font-medium border-l border-stone-300 ${form.gender === "nu" ? "bg-emerald-600 text-white" : "bg-white text-stone-600"}`}>Nữ</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Cao (cm)</label>
            <input type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} placeholder="170"
              className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Nặng (kg)</label>
            <input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="65"
              className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Vòng eo (cm)</label>
            <input type="number" value={form.waist} onChange={(e) => setForm({ ...form, waist: e.target.value })} placeholder="80"
              className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Mục tiêu</label>
          <div className="grid grid-cols-3 gap-2">
            {GOAL_OPTIONS.map((g) => (
              <button key={g.value} type="button" onClick={() => setForm({ ...form, goal: g.value })}
                className={`py-2 rounded-lg text-sm font-medium border ${form.goal === g.value ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-stone-600 border-stone-300"}`}>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Tần suất vận động</label>
          <div className="flex flex-col gap-2">
            {PAL_OPTIONS.map((p) => (
              <label key={p.value} className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer ${form.pal === p.value ? "border-emerald-500 bg-emerald-50" : "border-stone-200"}`}>
                <input type="radio" name="pal" checked={form.pal === p.value} onChange={() => setForm({ ...form, pal: p.value })} className="mt-1" />
                <span>
                  <span className="block text-sm font-medium text-stone-800">{p.label} ({p.value})</span>
                  <span className="block text-xs text-stone-500">{p.desc}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm">
          Đánh giá &amp; bắt đầu theo dõi
        </button>
        <p className="text-[11px] text-stone-400 mt-3 text-center">
          Công cụ mang tính giáo dục, tham khảo — không thay thế chẩn đoán hay tư vấn y khoa chuyên môn.
        </p>
      </form>
    </div>
  );
}
