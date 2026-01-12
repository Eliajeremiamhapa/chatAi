import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * FIX 1: Port Configuration
 * Back4app uses the PORT environment variable to route traffic.
 */
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serves static files if you decide to add a web interface later
app.use(express.static(path.join(__dirname, "public")));

/**
 * FIX 2: AI SDK Initialization
 * Make sure GOOGLE_API_KEY is set in your Back4app Dashboard.
 */
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Health Check - Essential for Back4app deployment success
app.get("/", (req, res) => {
  res.status(200).json({ 
    status: "online", 
    message: "EliaGPT API is active",
    endpoint: "/ask" 
  });
});

// Main API Route for Android & Web
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Please enter a message." });
    }

    /**
     * Using Gemini 2.0 Flash (Latest Stable for 2026)
     * This model is faster and smarter than 1.5.
     */
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(question);
    const response = await result.response;
    const answer = response.text();

    // Standard JSON response for easy parsing in Android (Retrofit/GSON)
    res.json({ 
      success: true,
      answer: answer 
    });

  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ 
      success: false, 
      error: "AI request failed.", 
      message: error.message 
    });
  }
});

/**
 * FIX 3: Host Binding
 * Binding to "0.0.0.0" is mandatory for Docker/Container environments.
 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 EliaGPT API running on port ${PORT}`);
});

