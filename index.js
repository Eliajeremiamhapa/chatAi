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
 * FIX 1: Use Back4app's dynamic port. 
 * The platform injects a port number into process.env.PORT.
 */
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/**
 * FIX 2: Correct SDK Initialization.
 * Ensure you have run: npm install @google/generative-ai
 */
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Root Health Check (Required for Back4app to show "Healthy")
app.get("/", (req, res) => {
  res.status(200).send("Chatbot Server Online");
});

// Chatbot Route
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Please enter a message." });
    }

    // Use a stable model version
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(question);
    const response = await result.response;
    const answer = response.text();

    res.json({ answer });
  } catch (error) {
    console.error("Deployment Error:", error);
    res.status(500).json({ error: "AI request failed.", message: error.message });
  }
});

/**
 * FIX 3: Bind to 0.0.0.0
 * This allows the container to accept external traffic.
 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
