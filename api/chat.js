// api/chat.js
// Vercel Serverless Function — chạy trên server, KHÔNG lộ GEMINI_API_KEY ra trình duyệt.
// Cần thiết lập biến môi trường GEMINI_API_KEY trong Vercel Project Settings > Environment Variables.
// Lấy key miễn phí, không cần thẻ, tại: https://aistudio.google.com/apikey
// Lưu ý: chức năng này CHỈ hoạt động khi deploy qua Vercel (hoặc nền tảng có hỗ trợ serverless function).
// GitHub Pages là hosting tĩnh, không chạy được file này.

const GEMINI_MODEL = "gemini-3.6-flash"; // model miễn phí hiện tại của Gemini API

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server chưa cấu hình GEMINI_API_KEY. Vào Vercel Project Settings > Environment Variables để thêm." });
    return;
  }

  const { messages, profile } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "Thiếu nội dung hội thoại." });
    return;
  }
  if (messages.length > 30) {
    res.status(400).json({ error: "Cuộc trò chuyện quá dài, hãy bắt đầu cuộc trò chuyện mới." });
    return;
  }

  const systemPrompt = buildSystemPrompt(profile);

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { maxOutputTokens: 700 },
        }),
      }
    );

    const data = await upstream.json();

    if (!upstream.ok) {
      res.status(upstream.status).json({ error: data?.error?.message || "Lỗi khi gọi AI." });
      return;
    }

    const reply = (data.candidates?.[0]?.content?.parts || [])
      .map((p) => p.text || "")
      .join("\n");

    res.status(200).json({ reply: reply || "(Không có phản hồi)" });
  } catch (err) {
    res.status(500).json({ error: "Không kết nối được tới AI: " + err.message });
  }
}

function buildSystemPrompt(profile) {
  const base =
    "Bạn là huấn luyện viên dinh dưỡng AI trong một ứng dụng cá nhân. Trả lời bằng tiếng Việt, ngắn gọn, thực tế, dễ áp dụng. " +
    "KHÔNG đưa ra chẩn đoán y khoa, KHÔNG cam kết kết quả cụ thể theo thời gian (vd. giảm X kg trong Y ngày), KHÔNG dùng ngôn từ chê bai ngoại hình. " +
    "Nếu câu hỏi có dấu hiệu cần thăm khám y tế, khuyên người dùng gặp bác sĩ/chuyên gia dinh dưỡng thay vì tự trả lời chi tiết.";

  if (!profile) return base;

  return `${base}

Hồ sơ hiện tại của người dùng (dùng để cá nhân hoá câu trả lời):
- Tên: ${profile.name || "Không rõ"} | Tuổi: ${profile.age} | Giới tính: ${profile.gender === "nam" ? "Nam" : "Nữ"}
- Chiều cao: ${profile.height}cm | Cân nặng: ${profile.weight}kg | Vòng eo: ${profile.waist}cm
- BMI: ${profile.bmi} (${profile.bmiLabel}) | WHtR: ${profile.whtr} (${profile.highRisk ? "đang cảnh báo mỡ nội tạng cao" : "trong ngưỡng an toàn"})
- Mục tiêu: ${profile.goalLabel}
- BMR: ${profile.bmr} kcal | TDEE: ${profile.tdee} kcal | Calo mục tiêu/ngày: ${profile.target} kcal
- Macro mục tiêu mỗi ngày: Đạm ${profile.proteinG}g, Carb ${profile.carbG}g, Fat ${profile.fatG}g`;
}
