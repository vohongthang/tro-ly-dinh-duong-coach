// src/data/foodDatabase.js
// CSDL thực phẩm chuẩn hoá trên 100g. Nguồn: NIN = Viện Dinh dưỡng Quốc gia Việt Nam, USDA = USDA FoodData Central.
// caution: true = tinh bột nhanh / nên hạn chế khi hồ sơ đang cảnh báo mỡ nội tạng cao.

export const BASE_FOODS = [
  { id: "com-te", name: "Cơm tẻ", source: "NIN", kcal: 130, protein: 2.5, fat: 0.3, carb: 28.3, caution: true },
  { id: "uc-ga", name: "Ức gà (thô)", source: "NIN", kcal: 110, protein: 22.5, fat: 2.1, carb: 0 },
  { id: "thit-lon-nac", name: "Thịt lợn nạc", source: "NIN", kcal: 139, protein: 19, fat: 7, carb: 0 },
  { id: "rau-muong", name: "Rau muống", source: "NIN", kcal: 23, protein: 3.2, fat: 0.2, carb: 2.5 },
  { id: "trung-ga", name: "Trứng gà", source: "NIN", kcal: 166, protein: 14.8, fat: 11.6, carb: 0.5 },
  { id: "pho-bo", name: "Phở bò (quy đổi)", source: "NIN", kcal: 150, protein: 6, fat: 4, carb: 22, caution: true },
  { id: "ca-ro-phi", name: "Cá rô phi", source: "NIN", kcal: 100, protein: 20, fat: 2, carb: 0 },
  { id: "dau-phu", name: "Đậu phụ", source: "NIN", kcal: 76, protein: 8, fat: 4.8, carb: 1.9 },
  { id: "bun-gao", name: "Bún gạo", source: "NIN", kcal: 110, protein: 2, fat: 0.2, carb: 25, caution: true },
  { id: "tom-luoc", name: "Tôm luộc", source: "USDA", kcal: 99, protein: 21, fat: 1.4, carb: 0.2 },
  { id: "bong-cai-xanh", name: "Bông cải xanh", source: "USDA", kcal: 35, protein: 2.8, fat: 0.4, carb: 6 },
  { id: "ca-chua", name: "Cà chua", source: "USDA", kcal: 18, protein: 0.9, fat: 0.2, carb: 3.9 },
  { id: "yen-mach", name: "Yến mạch (hạt)", source: "USDA", kcal: 389, protein: 16.9, fat: 6.9, carb: 66.3 },
  { id: "qua-bo", name: "Quả bơ", source: "USDA", kcal: 160, protein: 2, fat: 15, carb: 9 },
  { id: "khoai-lang", name: "Khoai lang", source: "USDA", kcal: 86, protein: 1.6, fat: 0.1, carb: 20.1 },
  { id: "sua-hanh-nhan", name: "Sữa hạnh nhân", source: "USDA", kcal: 15, protein: 0.6, fat: 1.1, carb: 0.3 },
  { id: "sua-tuoi-khong-duong", name: "Sữa tươi không đường", source: "USDA", kcal: 42, protein: 3.4, fat: 1, carb: 5 },
  { id: "hat-hanh-nhan", name: "Hạt hạnh nhân", source: "USDA", kcal: 579, protein: 21, fat: 50, carb: 22 },
  { id: "cai-xoan-kale", name: "Cải xoăn Kale", source: "USDA", kcal: 49, protein: 4.3, fat: 0.9, carb: 8.8 },
  { id: "chuoi-chin", name: "Chuối chín", source: "USDA", kcal: 89, protein: 1.1, fat: 0.3, carb: 22.8 },
];

// Hiển thị khi hồ sơ đang cảnh báo mỡ nội tạng cao (WHtR >= 0.5)
export const RECOMMENDED_FOODS = [
  { name: "Ức gà, cá rô phi, tôm", reason: "đạm nạc, ít béo bão hoà" },
  { name: "Yến mạch, khoai lang", reason: "tinh bột hấp thu chậm, nhiều chất xơ" },
  { name: "Quả bơ, hạt hạnh nhân", reason: "chất béo không bão hoà tốt cho tim mạch" },
  { name: "Rau muống, bông cải xanh, cải xoăn Kale", reason: "giàu chất xơ hoà tan, ít calo" },
  { name: "Đậu phụ", reason: "đạm thực vật, béo tốt" },
];

export const AVOID_FOODS = [
  { name: "Cơm trắng, bún, phở ăn quá nhiều", reason: "tinh bột tinh chế, hấp thu đường nhanh" },
  { name: "Nước ngọt có gas, trà sữa", reason: "đường bổ sung cao, rỗng calo" },
  { name: "Đồ chiên rán, mỡ động vật", reason: "chất béo bão hoà, khó kiểm soát calo" },
  { name: "Bánh kẹo, đồ ngọt đóng gói", reason: "đường tinh luyện, ít giá trị dinh dưỡng" },
];
