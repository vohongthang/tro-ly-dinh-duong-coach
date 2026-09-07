// src/utils/nutritionMath.js

/** BMR theo công thức Mifflin-St Jeor (1990) */
export function calculateBMR({ gender, weight, height, age }) {
  return gender === "nam"
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
}

/** TDEE = BMR x hệ số vận động (PAL) */
export function calculateTDEE(bmr, pal) {
  return bmr * pal;
}

/** BMI = cân nặng(kg) / chiều cao(m)^2 */
export function calculateBMI(weight, height) {
  return weight / Math.pow(height / 100, 2);
}

/** Phân loại BMI theo chuẩn Châu Á (IDI & WPRO / WHO Western Pacific) — sát thể trạng người Việt hơn ngưỡng phương Tây */
export function bmiCategory(bmi) {
  if (bmi < 18.5) return "Thiếu cân";
  if (bmi < 23) return "Bình thường";
  if (bmi < 25) return "Thừa cân";
  if (bmi < 30) return "Béo phì độ I";
  return "Béo phì độ II trở lên";
}

/** Tỷ lệ Vòng eo / Chiều cao (Waist-to-Height Ratio) */
export function calculateWHtR(waist, height) {
  return waist / height;
}

/** Ngưỡng cảnh báo mỡ nội tạng cao theo tài liệu tham khảo phổ biến (NICE/Ashwell): WHtR >= 0.5 */
export function isHighRisk(whtr) {
  return whtr >= 0.5;
}

/** Quy đổi % Macro sang số gram, dựa trên Calo mục tiêu. 1g Protein/Carb = 4kcal, 1g Fat = 9kcal */
export function calculateMacroTargets(targetCalories, macroRatios) {
  return {
    proteinG: Math.round((targetCalories * macroRatios.protein) / 4),
    carbG: Math.round((targetCalories * macroRatios.carb) / 4),
    fatG: Math.round((targetCalories * macroRatios.fat) / 9),
  };
}

/**
 * Tổng hợp toàn bộ hồ sơ cá nhân từ form nhập liệu.
 * goalOptions: mảng GOAL_OPTIONS (từ constants.js)
 * highRiskMacro: object HIGH_RISK_MACRO (từ constants.js)
 */
export function buildProfile(form, goalOptions, highRiskMacro) {
  const age = parseFloat(form.age);
  const height = parseFloat(form.height);
  const weight = parseFloat(form.weight);
  const waist = parseFloat(form.waist);

  const bmr = calculateBMR({ gender: form.gender, weight, height, age });
  const tdee = calculateTDEE(bmr, form.pal);
  const goalOpt = goalOptions.find((g) => g.value === form.goal);
  const target = tdee + goalOpt.adjust;

  const bmi = calculateBMI(weight, height);
  const whtr = calculateWHtR(waist, height);
  const highRisk = isHighRisk(whtr);

  const macro = highRisk ? highRiskMacro : goalOpt.macro;
  const { proteinG, carbG, fatG } = calculateMacroTargets(target, macro);

  return {
    ...form,
    age, height, weight, waist,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    target: Math.round(target),
    proteinG, carbG, fatG,
    goalLabel: goalOpt.label,
    bmi: Math.round(bmi * 10) / 10,
    bmiLabel: bmiCategory(bmi),
    whtr: Math.round(whtr * 100) / 100,
    highRisk,
  };
}

/**
 * Sinh thực đơn mẫu 1 ngày (4 bữa), scale khẩu phần theo đúng Calo mục tiêu cá nhân.
 * templates: object MEAL_TEMPLATES (từ constants.js), dạng { normal: {...}, highRisk: {...} }
 * allFoods: mảng thực phẩm (BASE_FOODS + customFoods) để tra cứu macro theo id
 */
export function generateMealPlan(profile, allFoods, templates) {
  const template = profile.highRisk ? templates.highRisk : templates.normal;

  let baselineKcal = 0;
  Object.values(template).forEach((items) =>
    items.forEach((it) => {
      const f = allFoods.find((x) => x.id === it.id);
      if (f) baselineKcal += (f.kcal * it.grams) / 100;
    })
  );
  if (baselineKcal <= 0) return null;

  const scale = profile.target / baselineKcal;
  const plan = {};
  Object.entries(template).forEach(([mealKey, items]) => {
    plan[mealKey] = items
      .map((it) => {
        const f = allFoods.find((x) => x.id === it.id);
        if (!f) return null;
        const g = Math.round((it.grams * scale) / 5) * 5;
        const ratio = g / 100;
        return {
          id: Date.now() + Math.random(),
          name: f.name,
          grams: g,
          kcal: f.kcal * ratio,
          protein: f.protein * ratio,
          fat: f.fat * ratio,
          carb: f.carb * ratio,
          caution: !!f.caution,
        };
      })
      .filter(Boolean);
  });
  return plan;
}

/** Định dạng số theo chuẩn Việt Nam, làm tròn số nguyên */
export function fmt(n) {
  return Math.round(n).toLocaleString("vi-VN");
}
