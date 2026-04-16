// server.js or routes/ai.js
import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/automate-interviews', async (req, res) => {
  const { prompt } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
      The user is looking for jobs related to: "${prompt}".
      Generate 3 fictional but realistic upcoming interview schedules.
      Return ONLY a JSON array of objects with these exact keys:
      "company", "role", "date" (use format DD/MM/YYYY), and "colorHex" (randomly choose one from: #B4B9E8, #00A86B, #FF9B94).
      Do not include any markdown formatting like \`\`\`json. Just the raw array.
    `;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response in case Gemini adds markdown backticks
    const cleanJson = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanJson);

    res.json(data);
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to generate interviews" });
  }
});

export default router;