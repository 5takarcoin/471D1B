const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/generate", async (req, res) => {
  const { jobTitle, jobDescription, seekerName, skills, experience } = req.body;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Write a professional cover letter for the following:
            Applicant Name: ${seekerName}
            Job Title: ${jobTitle}
            Job Description: ${jobDescription}
            Applicant Skills: ${skills}
            Applicant Experience: ${experience}
            Keep it concise, professional, and under 300 words.`
        }
      ]
    });

    const coverLetter = response.choices[0].message.content;
    res.json({ coverLetter });
  } catch (error) {
    console.error("Groq error:", error);
    res.status(500).json({ error: "Failed to generate cover letter" });
  }
});

module.exports = router;