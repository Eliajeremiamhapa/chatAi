import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// Health Check
app.get("/test", (req, res) => {
  res.send("Server is running!");
});

// Chatbot Route
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Please enter a message." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: question,
    });

    const answer =
      response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";

    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI request failed." });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
