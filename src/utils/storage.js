// src/utils/storage.js
// Toàn bộ đọc/ghi LocalStorage đi qua đây, có try/catch để không làm crash app
// nếu trình duyệt chặn LocalStorage (chế độ ẩn danh, quyền riêng tư, v.v.)

const PROFILE_KEY = "ndc_profile";
const CUSTOM_FOODS_KEY = "ndc_custom_foods";
const LOG_PREFIX = "ndc_log_"; // + YYYY-MM-DD

function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`[storage] Không đọc được key "${key}", dùng giá trị mặc định.`, err);
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[storage] Không ghi được key "${key}".`, err);
    return false;
  }
}

// ---------- Hồ sơ cá nhân ----------
export function loadProfile() {
  return safeGet(PROFILE_KEY, null);
}
export function saveProfile(profile) {
  return safeSet(PROFILE_KEY, profile);
}
export function clearProfile() {
  try {
    localStorage.removeItem(PROFILE_KEY);
    return true;
  } catch (err) {
    console.warn("[storage] Không xoá được hồ sơ.", err);
    return false;
  }
}

// ---------- Món tự thêm (Custom Foods) ----------
export function loadCustomFoods() {
  return safeGet(CUSTOM_FOODS_KEY, []);
}
export function saveCustomFoods(foods) {
  return safeSet(CUSTOM_FOODS_KEY, foods);
}

// ---------- Nhật ký ăn uống theo ngày ----------
function emptyDayLog() {
  return { sang: [], trua: [], toi: [], phu: [] };
}

export function loadDayLog(dateStr) {
  return safeGet(LOG_PREFIX + dateStr, emptyDayLog());
}
export function saveDayLog(dateStr, meals) {
  return safeSet(LOG_PREFIX + dateStr, meals);
}

/** Trả về YYYY-MM-DD theo giờ địa phương (tránh lệch ngày do toISOString dùng UTC) */
export function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Cộng/trừ số ngày cho một chuỗi YYYY-MM-DD, trả về chuỗi YYYY-MM-DD mới */
export function addDays(dateStr, delta) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + delta);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
