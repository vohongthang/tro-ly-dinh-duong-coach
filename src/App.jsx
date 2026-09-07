// src/App.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Settings, ChefHat } from "lucide-react";

import { BASE_FOODS } from "./data/foodDatabase.js";
import { GOAL_OPTIONS, HIGH_RISK_MACRO, MEAL_TEMPLATES, GENERAL_TIPS, HIGH_RISK_TIPS } from "./data/constants.js";
import { buildProfile, generateMealPlan } from "./utils/nutritionMath.js";
import {
  loadProfile, saveProfile, clearProfile,
  loadCustomFoods, saveCustomFoods,
  loadDayLog, saveDayLog, todayStr,
} from "./utils/storage.js";

import ProfileSetup from "./components/ProfileSetup.jsx";
import TipCard from "./components/TipCard.jsx";
import HealthCard from "./components/HealthCard.jsx";
import MacroDashboard from "./components/MacroDashboard.jsx";
import DateNav from "./components/DateNav.jsx";
import MealLog from "./components/MealLog.jsx";
import FoodModal from "./components/FoodModal.jsx";
import MealPlanModal from "./components/MealPlanModal.jsx";

function pickTip(pool, profile) {
  return pool[Math.floor(Math.random() * pool.length)](profile);
}

export default function App() {
  // ---------- Hồ sơ & món tự thêm: nạp 1 lần từ LocalStorage khi mount ----------
  const [profile, setProfile] = useState(() => loadProfile());
  const [customFoods, setCustomFoods] = useState(() => loadCustomFoods());

  // ---------- Ngày đang xem + nhật ký của ngày đó ----------
  const [selectedDate, setSelectedDate] = useState(() => todayStr());
  const [meals, setMeals] = useState(() => loadDayLog(todayStr()));
  const [dayLoaded, setDayLoaded] = useState(true); // tránh ghi đè trước khi load xong khi đổi ngày

  const [modalMeal, setModalMeal] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [tip, setTip] = useState("");

  const allFoods = useMemo(() => [...BASE_FOODS, ...customFoods], [customFoods]);

  // Khi đổi ngày -> nạp nhật ký của ngày đó
  useEffect(() => {
    setDayLoaded(false);
    setMeals(loadDayLog(selectedDate));
    setDayLoaded(true);
  }, [selectedDate]);

  // Ghi nhật ký mỗi khi meals thay đổi (bỏ qua lần ghi đầu tiên ngay sau khi vừa nạp)
  useEffect(() => {
    if (!dayLoaded) return;
    saveDayLog(selectedDate, meals);
  }, [meals, selectedDate, dayLoaded]);

  // Ghi hồ sơ & món tự thêm mỗi khi thay đổi
  useEffect(() => {
    if (profile) saveProfile(profile);
  }, [profile]);
  useEffect(() => {
    saveCustomFoods(customFoods);
  }, [customFoods]);

  // Sinh lời khuyên ban đầu khi đã có hồ sơ (kể cả khi tải lại trang)
  useEffect(() => {
    if (profile && !tip) {
      const pool = profile.highRisk ? [...HIGH_RISK_TIPS, ...GENERAL_TIPS] : GENERAL_TIPS;
      setTip(pickTip(pool, profile));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  function handleProfileSubmit(form) {
    const newProfile = buildProfile(form, GOAL_OPTIONS, HIGH_RISK_MACRO);
    setProfile(newProfile);
    const pool = newProfile.highRisk ? [...HIGH_RISK_TIPS, ...GENERAL_TIPS] : GENERAL_TIPS;
    setTip(pickTip(pool, newProfile));
  }

  function handleEditProfile() {
    clearProfile();
    setProfile(null);
  }

  function shuffleTip() {
    if (!profile) return;
    const pool = profile.highRisk ? [...HIGH_RISK_TIPS, ...GENERAL_TIPS] : GENERAL_TIPS;
    setTip(pickTip(pool, profile));
  }

  const totals = useMemo(() => {
    let kcal = 0, protein = 0, carb = 0, fat = 0;
    Object.values(meals).forEach((list) =>
      (list || []).forEach((item) => {
        kcal += item.kcal; protein += item.protein; carb += item.carb; fat += item.fat;
      })
    );
    return { kcal, protein, carb, fat };
  }, [meals]);

  function handleConfirmAddFood(mealKey, food, grams) {
    const ratio = grams / 100;
    const entry = {
      id: Date.now() + Math.random(),
      name: food.name,
      grams,
      kcal: food.kcal * ratio,
      protein: food.protein * ratio,
      fat: food.fat * ratio,
      carb: food.carb * ratio,
      caution: !!food.caution,
    };
    setMeals((prev) => ({ ...prev, [mealKey]: [...(prev[mealKey] || []), entry] }));
    setModalMeal(null);
  }

  function handleRemoveFood(mealKey, id) {
    setMeals((prev) => ({ ...prev, [mealKey]: prev[mealKey].filter((i) => i.id !== id) }));
  }

  function handleSaveCustomFood(food) {
    setCustomFoods((prev) => [...prev, food]);
  }

  const generatedPlan = useMemo(() => {
    if (!profile) return null;
    return generateMealPlan(profile, allFoods, MEAL_TEMPLATES);
  }, [profile, allFoods]);

  function handleApplyPlan() {
    if (!generatedPlan) return;
    setMeals(generatedPlan);
    setShowPlanModal(false);
  }

  // ---------- Chưa có hồ sơ -> màn hình thiết lập ----------
  if (!profile) {
    return <ProfileSetup onSubmit={handleProfileSubmit} />;
  }

  // ---------- Màn hình chính ----------
  return (
    <div className="min-h-screen bg-stone-50 pb-16">
      <div className="bg-emerald-700 text-white px-4 sm:px-6 py-5">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-xs text-emerald-200 uppercase tracking-wide">{profile.goalLabel}</div>
            <h1 className="text-lg font-semibold">{profile.name ? `Xin chào, ${profile.name}` : "Nhật ký ăn uống"}</h1>
          </div>
          <button onClick={handleEditProfile} className="w-9 h-9 rounded-full bg-emerald-600/60 hover:bg-emerald-600 flex items-center justify-center" title="Chỉnh sửa hồ sơ">
            <Settings size={17} />
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-3 space-y-5">
        <TipCard tip={tip} onShuffle={shuffleTip} />
        <HealthCard profile={profile} />
        <MacroDashboard profile={profile} totals={totals} />

        <DateNav selectedDate={selectedDate} onChange={setSelectedDate} />

        <button onClick={() => setShowPlanModal(true)}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-2xl text-sm shadow-sm">
          <ChefHat size={17} /> Xem thực đơn gợi ý hôm nay
        </button>

        <MealLog meals={meals} highRisk={profile.highRisk} onOpenModal={setModalMeal} onRemoveFood={handleRemoveFood} />
      </div>

      {showPlanModal && generatedPlan && (
        <MealPlanModal
          plan={generatedPlan}
          target={profile.target}
          highRisk={profile.highRisk}
          onClose={() => setShowPlanModal(false)}
          onApply={handleApplyPlan}
        />
      )}

      {modalMeal && (
        <FoodModal
          mealKey={modalMeal}
          allFoods={allFoods}
          highRisk={profile.highRisk}
          onClose={() => setModalMeal(null)}
          onConfirmAdd={handleConfirmAddFood}
          onSaveCustomFood={handleSaveCustomFood}
        />
      )}
    </div>
  );
}
