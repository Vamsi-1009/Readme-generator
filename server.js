require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const app = express();
app.use(cors());
app.use(express.json());
// Use an environment variable instead of a hardcoded string
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
app.get('/', (req, res) => {
    res.send("✅ Backend Server is Running on Port 3001!");
});
app.post('/generate-readme', async (req, res) => {
    const { prompt } = req.body;
    console.log("--- Validating and Generating Documentation ---");
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{
                parts: [{
                    text: `TASK: You are a professional documentation bot. 
                    
                    EVALUATION STEP:
                    Analyze if the following user input is related to a software project, application, or technical tool description.
                    - IF UNRELATED (e.g., casual chat, general knowledge, non-technical): Respond ONLY with the exact phrase "INVALID_CONTENT".
                    - IF RELATED: Act as an expert Full-Stack Developer and Technical Writer to generate a professional GitHub README.md.
                    GENERATION RULES (If Related):
                    1. TECH STACK: Infer the most logical modern stack if not provided and list them in a table with badges.
                    2. FOLDER STRUCTURE: Generate a standard directory tree required for this project type.
                    3. INSTALLATION: Provide step-by-step terminal commands.
                    4. BILINGUAL: Preserve any Telugu/English bilingual logic provided.
                    5. FORMAT: Use professional Markdown with H1, H2, and bold text.
                    USER INPUT: 
                    ${prompt}`
                }]
            }]
        });
        const text = response.text.trim();
        // Safety Filter check
        if (text === "INVALID_CONTENT") {
            return res.json({ markdown: "⚠️ This text does not appear to be related to a project. Please provide project details to generate a README." });
        }
        console.log("✅ Successfully Generated!");
        res.json({ markdown: text });
    } catch (error) {
        console.error("❌ ERROR:", error.message);
        res.status(500).json({ error: error.message });
    }
});
app.listen(3001, () => console.log('🚀 Server running on http://localhost:3001'));
