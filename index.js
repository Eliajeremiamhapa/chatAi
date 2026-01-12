import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. Test via Browser (Visit your URL in Chrome)
app.get("/", (req, res) => {
  res.send("Hello World! The server is alive and reachable.");
});

// 2. Test via API (The endpoint your app/website calls)
app.post("/ask", (req, res) => {
  console.log("Received a request:", req.body);
  res.json({ 
    success: true, 
    answer: "Hello World! Your API connection is working perfectly." 
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Test Server running on port ${PORT}`);
});
