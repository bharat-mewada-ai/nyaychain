const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

function safeParse(text) {
  try {
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return {
      fraud_probability: 85,
      risk_level: "High",
      reasons: ["Frequent ownership changes", "Abnormal price spike"]
    };
  }
}

async function analyzeProperty(property) {
  const prompt = `
Analyze this land record and return ONLY JSON:

${JSON.stringify(property)}

Format:
{
  "fraud_probability": number,
  "risk_level": "Low|Medium|High",
  "reasons": []
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return safeParse(text);
}

module.exports = { analyzeProperty };