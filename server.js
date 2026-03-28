import express from "express";

const app = express();
app.use(express.json());

app.post("/ai", (req, res) => {
    const message = req.body.message;
    res.json({ reply: "AI ตอบ: " + message });
});

app.get("/", (req, res) => {
    res.send("AI Server Running!");
});

app.listen(3000, () => {
    console.log("Server started");
});

