cat > /mnt/user-data/outputs/server.js << 'EOF'
import express from "express";
import https from "https";

const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function cleanCode(text) {
  // ลบ markdown backticks ออก
  return text
    .replace(/```[\w]*\n?/g, "")
    .replace(/```/g, "")
    .trim();
}

function callGemini(prompt) {
  return new Promise((resolve, reject) => {
    const systemPrompt =
      "You are an expert Roblox Luau scripter. " +
      "Respond with ONLY clean working Luau code — no markdown, no backticks, no explanation before the code. " +
      "Add short inline comments in Thai. " +
      "At the end add a --[[ USAGE: ]] block explaining where to place the script.";

    const body = JSON.stringify({
      contents: [{ parts: [{ text: systemPrompt + "\n\n" + prompt }] }]
    });

    const options = {
      hostname: "generativelanguage.googleapis.com",
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          const raw = parsed.candidates?.[0]?.content?.parts?.[0]?.text || "-- เกิดข้อผิดพลาด";
          resolve(cleanCode(raw));
        } catch (e) { reject(e); }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("[AI] ได้รับ prompt:", prompt.slice(0, 60) + "...");
    const code = await callGemini(prompt);
    res.json({ code });
    console.log("[AI] ส่ง code กลับแล้ว ✓");
  } catch (err) {
    console.error("[AI] Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => res.send("Roblox AI Backend (Gemini) is running!"));
app.listen(3000, () => console.log("✅ Server running on port 3000"));
EOF
Output

exit code 0

Presented file
Done
โหลดไฟล์แล้วทำแบบนี้เลยครับ 👇

ไปที่ GitHub → repo roblox-ai-server
คลิกไฟล์ server.js → กด ดินสอ Edit
ลบทั้งหมด แล้ว paste code ใหม่จากไฟล์ที่โหลด
กด Commit changes
รอ Render deploy เสร็จ แล้วลองใช้ plugin อีกครั้งครับ! 🚀
Server
JS 






