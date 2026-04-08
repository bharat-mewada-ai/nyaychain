// app.js
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import multer from 'multer';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import crypto from 'crypto';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --------------------
// Gemini Setup
// --------------------
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// --------------------
// Session Memory
// --------------------
const sessions = {};

// --------------------
// Fake Blockchain Store
// --------------------
const documentLedger = {}; // { hash: timestamp }

// --------------------
// Bot Knowledge
// --------------------
const botData = `
NyayChain is a blockchain-based land/document verification system.
Features:
- AI fraud detection
- Ledger-based verification
- Tamper detection using hash
`;

// --------------------
// File Upload
// --------------------
const upload = multer({ dest: 'uploads/' });

// --------------------
// Hash Generator
// --------------------
function generateHash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// --------------------
// Health Check
// --------------------
app.get('/', (req, res) => {
  res.send('NyayChain FULL Backend Running 🚀');
});

// --------------------
// CHAT API
// --------------------
app.post('/api/chat', async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  if (!sessions[userId]) sessions[userId] = [];

  sessions[userId].push({ role: 'user', content: message });

  const prompt = `
You are NyayChain AI assistant.

Info:
${botData}

Conversation:
${sessions[userId].map(m => `${m.role}: ${m.content}`).join('\n')}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });

    const reply = response.text;
    sessions[userId].push({ role: 'bot', content: reply });

    res.json({ success: true, reply });

  } catch (err) {
    res.status(500).json({ error: 'Chat failed' });
  }
});

// --------------------
// DOCUMENT ANALYSIS
// --------------------
app.post('/api/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype;

    let extractedText = '';

    // --------------------
    // PDF
    if (fileType === 'application/pdf') {
      const buffer = fs.readFileSync(filePath);
      const data = await pdfParse(buffer);
      extractedText = data.text;

      // If empty → OCR fallback
      if (!extractedText.trim()) {
        const ocr = await Tesseract.recognize(filePath, 'eng');
        extractedText = ocr.data.text;
      }
    }

    // --------------------
    // Image (OCR)
    else if (fileType.startsWith('image/')) {
      const ocr = await Tesseract.recognize(filePath, 'eng');
      extractedText = ocr.data.text;
    }

    // --------------------
    // Text
    else {
      extractedText = fs.readFileSync(filePath, 'utf-8');
    }

    // --------------------
    // HASH (Blockchain-style)
    const hash = generateHash(extractedText);

    let blockchainStatus = "new";

    if (documentLedger[hash]) {
      blockchainStatus = "already exists (verified earlier)";
    } else {
      documentLedger[hash] = new Date().toISOString();
    }

    // --------------------
    // AI Fraud Detection
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

    // Cleanup
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      blockchain: blockchainStatus,
      hash: hash,
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