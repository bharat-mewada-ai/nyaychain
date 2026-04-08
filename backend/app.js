// app.js
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
const port = process.env.PORT || 3000;

// --------------------
// Middleware
// --------------------
app.use(cors());
app.use(express.json());

// --------------------
// Session memory store
// --------------------
const sessions = {}; // { userId: [{role, content}] }

// --------------------
// Bot data / knowledge
// --------------------
const botData = `
NyayChain Features:
1. Ledger creation
2. Transaction verification
3. AI fraud detection
`;

// --------------------
// Initialize Gemini client
// --------------------
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// --------------------
// Health check route
// --------------------
app.get('/', (req, res) => {
  res.send('NyayChain Bot Backend Running 🚀');
});

// --------------------
// Chat route
// --------------------
app.post('/api/chat', async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) return res.status(400).json({ error: 'Missing userId or message' });

  // Initialize session if first time
  if (!sessions[userId]) sessions[userId] = [];

  // Add user message to session
  sessions[userId].push({ role: 'user', content: message });

  // Build prompt: bot data + conversation history
  const prompt = `
You are a NyayChain chatbot.
Use the following info when answering:
${botData}

Conversation so far:
${sessions[userId].map(msg => `${msg.role}: ${msg.content}`).join('\n')}
`;

  // Call Gemini
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });

    const botReply = response.text;

    // Save bot reply to session
    sessions[userId].push({ role: 'bot', content: botReply });

    res.json({ success: true, reply: botReply });

  } catch (err) {
    console.error('Gemini API error:', err);
    res.status(500).json({ error: 'Failed to get response from Gemini' });
  }
});

// --------------------
// Start server
// --------------------
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});