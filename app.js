// app.js
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import multer from 'multer';
import fs from 'fs';
import * as pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import crypto from 'crypto';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

// --------------------
// Gemini
// --------------------
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// --------------------
// Upload
// --------------------
const upload = multer({ dest: 'uploads/' });

// --------------------
// Memory store (temporary blockchain)
// --------------------
const documentStore = {}; // hash → timestamp

// --------------------
// Hash
// --------------------
function generateHash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// --------------------
app.get('/', (req, res) => {
  res.send('NyayChain Backend Running 🚀 (No DB Mode)');
});

// --------------------
// ANALYZE
// --------------------
app.post('/api/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype;

    let extractedText = '';

    // PDF
    if (fileType === 'application/pdf') {
      const buffer = fs.readFileSync(filePath);
      const data = await pdfParse.default(buffer);
      extractedText = data.text;

      if (!extractedText.trim()) {
        const ocr = await Tesseract.recognize(filePath, 'eng');
        extractedText = ocr.data.text;
      }
    }

    // Image
    else if (fileType.startsWith('image/')) {
      const ocr = await Tesseract.recognize(filePath, 'eng');
      extractedText = ocr.data.text;
    }

    // Text
    else {
      extractedText = fs.readFileSync(filePath, 'utf-8');
    }

    // --------------------
    // EMPTY CHECK
    // --------------------
    if (!extractedText || extractedText.trim().length < 50) {
      fs.unlinkSync(filePath);

      return res.status(400).json({
        success: false,
        error: "Document unreadable or invalid"
      });
    }

    // --------------------
    // KEYWORD CHECK
    // --------------------
    const landKeywords = [
      "sale deed",
      "property",
      "land",
      "registry",
      "khasra",
      "khata",
      "patta",
      "survey number",
      "plot",
      "registration"
    ];

    let matchCount = 0;
    let matched = [];

    for (let keyword of landKeywords) {
      if (extractedText.toLowerCase().includes(keyword)) {
        matchCount++;
        matched.push(keyword);
      }
    }

    if (matchCount < 2) {
      fs.unlinkSync(filePath);

      return res.status(400).json({
        success: false,
        error: "Not a valid land document",
        matched_keywords: matched
      });
    }

    // --------------------
    // AI VALIDATION
    // --------------------
    const checkPrompt = `
You are a strict document classifier.

If the document is clearly a land/property registry document, answer YES.
Otherwise answer NO.

Reply ONLY: YES or NO

Document:
${extractedText}
`;

    const checkRes = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: checkPrompt
    });

    const aiAnswer = checkRes.text.trim().toUpperCase();

    if (aiAnswer !== "YES") {
      fs.unlinkSync(filePath);

      return res.status(400).json({
        success: false,
        error: "Rejected by AI"
      });
    }

    // --------------------
    // HASH (fake blockchain)
    // --------------------
    const hash = generateHash(extractedText);

    let blockchainStatus = "new";

    if (documentStore[hash]) {
      blockchainStatus = "already exists (verified earlier)";
    } else {
      documentStore[hash] = new Date().toISOString();
    }

    // --------------------
    // AI FRAUD ANALYSIS
    // --------------------
    const prompt = `
You are an AI fraud detection system.

Analyze document carefully.

Return STRICT JSON:
{
  "verified": true/false,
  "confidence": "low/medium/high",
  "issues": [],
  "summary": ""
}

Document:
${extractedText}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });

    let result;
    try {
      result = JSON.parse(response.text);
    } catch {
      result = { raw: response.text };
    }

    fs.unlinkSync(filePath);

    res.json({
      success: true,
      blockchain: blockchainStatus,
      hash,
      matched_keywords: matched,
      ai_result: result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// --------------------
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});