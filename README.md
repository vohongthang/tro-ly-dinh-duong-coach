# Trợ lý Chẩn đoán & Tư vấn Dinh dưỡng Thông minh

Ứng dụng cá nhân theo dõi Calo/Macro, đánh giá nguy cơ mỡ nội tạng (BMI, WHtR), gợi ý thực đơn và lời khuyên hàng ngày. Dữ liệu lưu hoàn toàn trên trình duyệt (LocalStorage) — không cần server/database.

## Cấu trúc dự án

```
src/
  data/
    foodDatabase.js   20 thực phẩm mẫu (NIN/USDA) + danh sách Nên ăn / Cần tránh
    constants.js      PAL, mục tiêu, thực đơn mẫu, lời khuyên
  utils/
    nutritionMath.js  Hàm tính BMR, TDEE, BMI, WHtR, sinh thực đơn mẫu
    storage.js        Đọc/ghi LocalStorage an toàn (hồ sơ, món tự thêm, nhật ký theo ngày)
  components/
    ProfileSetup.jsx  Màn hình thiết lập hồ sơ
    TipCard.jsx        Lời khuyên hàng ngày
    HealthCard.jsx     Đánh giá BMI/WHtR + khuyến nghị thực phẩm
    MacroDashboard.jsx Vòng tròn Calo + thanh Macro
    DateNav.jsx        Chọn ngày xem/nhập nhật ký
    MealLog.jsx        4 bữa ăn trong ngày
    FoodModal.jsx      Thêm món (tìm kiếm/tự thêm/nhập gram)
    MealPlanModal.jsx  Thực đơn gợi ý + áp dụng vào nhật ký
  App.jsx              Gắn kết toàn bộ, quản lý state + đồng bộ LocalStorage
  main.jsx             Điểm khởi chạy React
  index.css            Nạp Tailwind
```

## Chạy thử ở máy local

Cần cài [Node.js](https://nodejs.org) (bản 18 trở lên).

```bash
npm install
npm run dev
```

Mở link hiện ra trong terminal (thường là `http://localhost:5173`).

## Build bản production

```bash
npm run build
```

Kết quả nằm trong thư mục `dist/`.

## Đưa lên GitHub

```bash
git init
git add .
git commit -m "Khởi tạo Trợ lý Dinh dưỡng Thông minh"
git branch -M main
git remote add origin https://github.com/<ten-github-cua-ban>/<ten-repo>.git
git push -u origin main
```

## Deploy lên Vercel (khuyến nghị, dễ nhất)

1. Vào [vercel.com](https://vercel.com) → đăng nhập bằng GitHub.
2. "Add New Project" → chọn repo vừa push.
3. Vercel tự nhận diện đây là dự án Vite — bấm Deploy, không cần chỉnh gì thêm.
4. Xong sẽ có link dạng `https://<ten-repo>.vercel.app`.

## Deploy lên GitHub Pages

1. Mở `vite.config.js`, đổi `base: "/"` thành `base: "/<ten-repo>/"`.
2. Cài thêm gói hỗ trợ deploy:
   ```bash
   npm install --save-dev gh-pages
   ```
3. Thêm 2 dòng vào `scripts` trong `package.json`:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
4. Chạy:
   ```bash
   npm run deploy
   ```
5. Vào **Settings → Pages** của repo trên GitHub, chọn nhánh `gh-pages` làm nguồn. Link sẽ có dạng `https://<ten-github-cua-ban>.github.io/<ten-repo>/`.

## Lưu ý về dữ liệu

Toàn bộ hồ sơ, món tự thêm và nhật ký ăn uống lưu trong LocalStorage của trình duyệt — nghĩa là:
- Dữ liệu chỉ tồn tại trên **thiết bị và trình duyệt** bạn đang dùng để mở app.
- Xoá cache/dữ liệu trình duyệt sẽ mất toàn bộ lịch sử.
- Đây là công cụ giáo dục, tham khảo — không thay thế chẩn đoán hay tư vấn y khoa chuyên môn.
