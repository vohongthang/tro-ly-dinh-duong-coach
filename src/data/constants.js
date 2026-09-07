// src/data/constants.js

export const PAL_OPTIONS = [
  { value: 1.2, label: "Ít vận động", desc: "Dân văn phòng, gần như không tập" },
  { value: 1.375, label: "Vận động nhẹ", desc: "Tập nhẹ 1–3 buổi/tuần" },
  { value: 1.55, label: "Vận động vừa", desc: "Tập 3–5 buổi/tuần" },
  { value: 1.725, label: "Vận động nặng", desc: "Tập 6–7 buổi/tuần" },
];

// Macro mặc định theo mục tiêu (khi KHÔNG cảnh báo mỡ nội tạng cao)
export const GOAL_OPTIONS = [
  { value: "giam", label: "Giảm mỡ", adjust: -400, macro: { carb: 0.4, protein: 0.3, fat: 0.3 } },
  { value: "giu", label: "Giữ cân", adjust: 0, macro: { carb: 0.5, protein: 0.2, fat: 0.3 } },
  { value: "tang", label: "Tăng cơ", adjust: 400, macro: { carb: 0.55, protein: 0.25, fat: 0.2 } },
];

// Macro ép buộc khi WHtR >= 0.5 (ưu tiên hỗ trợ giảm mỡ nội tạng, ghi đè GOAL_OPTIONS.macro)
export const HIGH_RISK_MACRO = { carb: 0.35, protein: 0.35, fat: 0.3 };

export const MEAL_META = [
  { key: "sang", label: "Bữa sáng" },
  { key: "trua", label: "Bữa trưa" },
  { key: "toi", label: "Bữa tối" },
  { key: "phu", label: "Bữa phụ" },
];

// Thực đơn mẫu (baseline gram) — generateMealPlan() sẽ scale theo Calo mục tiêu thực tế của từng người
export const MEAL_TEMPLATES = {
  normal: {
    sang: [{ id: "trung-ga", grams: 100 }, { id: "com-te", grams: 100 }, { id: "rau-muong", grams: 50 }],
    trua: [{ id: "com-te", grams: 150 }, { id: "uc-ga", grams: 150 }, { id: "rau-muong", grams: 100 }],
    toi: [{ id: "com-te", grams: 100 }, { id: "thit-lon-nac", grams: 120 }, { id: "rau-muong", grams: 100 }],
    phu: [{ id: "chuoi-chin", grams: 100 }, { id: "hat-hanh-nhan", grams: 20 }],
  },
  highRisk: {
    sang: [{ id: "yen-mach", grams: 50 }, { id: "sua-hanh-nhan", grams: 200 }, { id: "chuoi-chin", grams: 50 }],
    trua: [{ id: "uc-ga", grams: 150 }, { id: "khoai-lang", grams: 150 }, { id: "cai-xoan-kale", grams: 100 }],
    toi: [{ id: "ca-ro-phi", grams: 150 }, { id: "rau-muong", grams: 150 }, { id: "qua-bo", grams: 50 }],
    phu: [{ id: "hat-hanh-nhan", grams: 20 }, { id: "cai-xoan-kale", grams: 50 }],
  },
};

export const GENERAL_TIPS = [
  (p) => `Uống đủ nước: khoảng ${(p.weight * 0.04).toFixed(1)} lít mỗi ngày dựa trên cân nặng của bạn.`,
  () => "Ngủ đủ 7–8 tiếng mỗi đêm giúp cơ thể phục hồi và kiểm soát cân nặng tốt hơn.",
  () => "Duy trì vận động đều đặn mỗi ngày — đi bộ nhẹ cũng tốt hơn là không vận động.",
];

export const HIGH_RISK_TIPS = [
  () => "Uống một cốc nước ấm trước bữa ăn 15 phút có thể giúp bạn kiểm soát khẩu phần tốt hơn.",
  () => "Thử đi bộ nhẹ nhàng 10 phút sau bữa tối để hỗ trợ nhạy cảm insulin và giảm tích mỡ bụng.",
  () => "Cắt giảm nước ngọt, trà sữa là bước đơn giản để giảm bớt lượng đường dư thừa mỗi ngày.",
];
