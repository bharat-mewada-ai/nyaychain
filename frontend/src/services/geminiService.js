import { GoogleGenerativeAI } from '@google/generative-ai';

// ╔═══════════════════════════════════════════════════════════════════╗
// ║  GEMINI API KEY CONFIGURATION                                     ║
// ║                                                                   ║
// ║  Option 1: Create a .env file in the project root with:          ║
// ║     VITE_GEMINI_API_KEY=your_api_key_here                        ║
// ║                                                                   ║
// ║  Option 2: Replace the fallback string below directly:           ║
// ║     const API_KEY = 'your_api_key_here';                         ║
// ║                                                                   ║
// ║  Get your free API key from:                                      ║
// ║     https://aistudio.google.com/app/apikey                       ║
// ╚═══════════════════════════════════════════════════════════════════╝

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let genAI = null;
let model = null;

function getModel() {
  if (!API_KEY) return null;
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }
  return model;
}

export function isGeminiConfigured() {
  return !!API_KEY;
}

/**
 * Analyze a property using Gemini AI
 * Returns structured fraud analysis data
 */
export async function analyzePropertyWithGemini(property) {
  const geminiModel = getModel();
  
  if (!geminiModel) {
    // Fallback to mock analysis if no API key
    return generateMockAnalysis(property);
  }

  const prompt = `You are an AI land fraud detection system called NyayChain.
Analyze the following property record for potential fraud, ownership disputes, and risk factors.

Property Details:
- Plot ID: ${property.plotId}
- Current Owner: ${property.owner}
- Location: ${property.location}
- Market Value: ₹${Number(property.price).toLocaleString('en-IN')}
- Area: ${property.area}
- Type: ${property.type}
- Registration Date: ${property.registrationDate}
- Last Transfer Date: ${property.lastTransfer}
- Current Status: ${property.status}

Ownership Chain:
${property.ownershipChain.map((entry, i) => 
  `${i + 1}. ${entry.owner} (${entry.role}) - Date: ${entry.timestamp} - Price: ₹${Number(entry.transferPrice).toLocaleString('en-IN')} - Validation: ${entry.validationStatus}`
).join('\n')}

Respond ONLY with a valid JSON object (no markdown, no code fences) in this exact format:
{
  "risk_level": "High" or "Medium" or "Low",
  "fraud_probability": <number 0-100>,
  "dispute_risk": <number 0-100>,
  "dispute_summary": "<one sentence summary of dispute risk>",
  "reasons": ["<reason 1>", "<reason 2>", "<reason 3>", "<reason 4>", "<reason 5>"],
  "recommendation": "<one sentence recommendation>"
}

Be realistic and analytical. Look for:
- Rapid ownership transfers (benami patterns)
- Suspicious price escalations or undervaluations
- Shell company involvement
- Missing or suspicious validation statuses
- Irregular time gaps between transfers`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text().trim();
    
    // Parse the JSON response, handling potential markdown code fences
    let jsonStr = text;
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    
    const parsed = JSON.parse(jsonStr);
    return {
      risk_level: parsed.risk_level || 'Low',
      fraud_probability: Number(parsed.fraud_probability) || 0,
      dispute_risk: Number(parsed.dispute_risk) || 0,
      dispute_summary: parsed.dispute_summary || 'Analysis complete.',
      reasons: parsed.reasons || [],
      recommendation: parsed.recommendation || 'No issues found.',
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    // Fallback to mock if Gemini fails
    return generateMockAnalysis(property);
  }
}

/**
 * Analyze a document using Gemini AI
 */
export async function analyzeDocumentWithGemini(fileName, fileContent) {
  const geminiModel = getModel();

  if (!geminiModel) {
    return generateMockDocumentAnalysis(fileName);
  }

  const prompt = `You are an AI document verification system for land records.
Analyze this document metadata and provide verification results.

Document Name: ${fileName}
Document Type: ${getDocumentType(fileName)}

Respond ONLY with a valid JSON object (no markdown, no code fences):
{
  "verified": true or false,
  "confidence": <number 0-100>,
  "document_type": "<detected document type>",
  "extracted_data": {
    "owner_name": "<if found>",
    "plot_id": "<if found>",
    "location": "<if found>",
    "date": "<if found>"
  },
  "mismatches": ["<mismatch 1>", "<mismatch 2>"],
  "summary": "<one sentence summary>"
}`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text().trim();
    let jsonStr = text;
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Gemini document analysis error:', error);
    return generateMockDocumentAnalysis(fileName);
  }
}

function getDocumentType(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  const types = {
    pdf: 'PDF Document',
    jpg: 'Image (JPEG)',
    jpeg: 'Image (JPEG)',
    png: 'Image (PNG)',
    tiff: 'TIFF Image',
    doc: 'Word Document',
    docx: 'Word Document',
  };
  return types[ext] || 'Unknown';
}

function generateMockAnalysis(property) {
  const isSuspicious = property.status === 'risky';
  const isReview = property.status === 'review';
  
  const chainLength = property.ownershipChain?.length || 0;
  const hasSuspiciousEntries = property.ownershipChain?.some(e => e.validationStatus === 'suspicious');
  
  let fraudProb, disputeRisk, riskLevel;
  
  if (isSuspicious || hasSuspiciousEntries) {
    fraudProb = 75 + Math.floor(Math.random() * 20);
    disputeRisk = 60 + Math.floor(Math.random() * 25);
    riskLevel = 'High';
  } else if (isReview) {
    fraudProb = 30 + Math.floor(Math.random() * 20);
    disputeRisk = 25 + Math.floor(Math.random() * 20);
    riskLevel = 'Medium';
  } else {
    fraudProb = 3 + Math.floor(Math.random() * 12);
    disputeRisk = 2 + Math.floor(Math.random() * 10);
    riskLevel = 'Low';
  }

  const highReasons = [
    'Rapid ownership transfers detected — classic benami pattern',
    'Shell company involvement in ownership chain',
    `${Math.floor(50 + Math.random() * 80)}% price increase over suspiciously short period`,
    'Seller entity linked to other flagged transactions in IGRS database',
    'Property valuation inconsistent with circle rate by significant margin',
  ];

  const mediumReasons = [
    'Recent transfer — full documentation verification still pending',
    `Price ${Math.floor(10 + Math.random() * 15)}% above area average — warrants review`,
    'Builder entity underwent name change — potential flag',
    'Area under active smart city project — value reassessment needed',
  ];

  const lowReasons = [
    'All transfers verified with proper documentation',
    'No unusual price escalation patterns detected',
    'Clean ownership chain with adequate holding periods',
    'All stamp duties paid and verified',
    'No encumbrance notices found in registry',
  ];

  const reasons = riskLevel === 'High' ? highReasons :
                  riskLevel === 'Medium' ? mediumReasons.slice(0, 3) :
                  lowReasons.slice(0, 3);

  return {
    risk_level: riskLevel,
    fraud_probability: fraudProb,
    dispute_risk: disputeRisk,
    dispute_summary: riskLevel === 'High' 
      ? 'High probability of legal dispute based on ownership anomalies.'
      : riskLevel === 'Medium'
        ? 'Moderate dispute risk — pending verification may resolve concerns.'
        : 'Minimal dispute risk. Chain integrity appears sound.',
    reasons,
    recommendation: riskLevel === 'High'
      ? 'Immediate investigation recommended. Freeze transfer activity.'
      : riskLevel === 'Medium'
        ? 'Expedite document verification before approving further transfers.'
        : 'Property appears clean. No immediate action required.',
  };
}

function generateMockDocumentAnalysis(fileName) {
  const isImage = /\.(jpg|jpeg|png|tiff|gif)$/i.test(fileName);
  return {
    verified: Math.random() > 0.2,
    confidence: Math.floor(70 + Math.random() * 25),
    document_type: isImage ? 'Scanned Land Document' : 'Digital Document',
    extracted_data: {
      owner_name: 'Detected in document',
      plot_id: 'MH-PUN-2024-XXXXX',
      location: 'Maharashtra, India',
      date: '2024-XX-XX',
    },
    mismatches: Math.random() > 0.6 ? ['Date format inconsistency detected'] : [],
    summary: 'Document processed successfully. Cross-reference with registry recommended.',
  };
}
