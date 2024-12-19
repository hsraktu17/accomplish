import express from "express";
import { apicall } from "./apicalling.js";
import pdfkit from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors());

// Store chat history in memory
const chatHistory = [];

// Predefined set of business-related questions
const businessQuestions = [
  "What is the name of your business?",
  "What products or services do you offer?",
  "Who are your target customers?",
  "What makes your business unique?",
  "What are your short-term and long-term goals?",
  "How do you plan to generate revenue?",
  "What inspired you to start this business?",
];

let currentQuestionIndex = 0;

app.post("/ask", async (req, res) => {
  const { message } = req.body;

  if (!message && currentQuestionIndex === 0) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    if (currentQuestionIndex < businessQuestions.length) {
      if (message) {
        
        chatHistory.push({ role: "user", content: message });
      }

      
      const nextQuestion = businessQuestions[currentQuestionIndex];
      chatHistory.push({ role: "model", content: nextQuestion });
      currentQuestionIndex++;
      return res.json({ response: nextQuestion, chatHistory });
    } else {
      
      chatHistory.push({ role: "user", content: message });
      const modelResponse = await apicall(message);
      chatHistory.push({ role: "model", content: modelResponse });
      res.json({ response: modelResponse, chatHistory });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/generate-report", (req, res) => {
  try {
    const doc = new pdfkit();
    const filePath = path.join(__dirname, "business_report.pdf");

    
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text("Business Chat Report", { align: "center" });
    doc.moveDown();

    chatHistory.forEach((entry) => {
      doc.fontSize(14).text(`${entry.role.toUpperCase()}: ${entry.content}`);
      doc.moveDown(0.5);
    });

    doc.end();

    res.download(filePath, "business_report.pdf", (err) => {
      if (err) {
        console.error("Error downloading report:", err);
        res.status(500).json({ error: "Failed to download report" });
      }
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    chatHistory.push({ role: "user", content: message });
    const modelResponse = await apicall(message);
    chatHistory.push({ role: "model", content: modelResponse });
    res.json({ response: modelResponse, chatHistory });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000, () => console.log("Server started at 3000"));
