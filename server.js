import express from "express";
import https from "https";

const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function callGemini(prompt) {
  return new Promise((resolve, reject) => {
    const systemPrompt =
      "You are an expert Roblox Luau scripter. " +
      "Respond with ONLY clean working Luau code — no markdown, no backticks, no explanation before the code. " +
      "Add short inline comments in Thai. " +
      "At the end add a --[[ USAGE: ]] block explaining where to place the script.";

    const body = JSON.stringify({
      contents: [
        {
          parts: [
            { text: systemPrompt + "\n\n" + prompt }
          ]
        }
      ]
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
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || "-- เกิดข้อผิดพลาด";
          resolve(text);
        } catch (e) {
          reject(e);
        }
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

