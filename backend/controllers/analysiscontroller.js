const data = require('../data/seed.json');
const { analyzeProperty } = require('../services/geminiService');

let analysisResults = {};

exports.runAnalysis = async (req, res) => {
  try {
    const property = data.find(p => p.propertyId === req.params.id);
    if (!property) return res.status(404).json({ error: "Not found" });

    const result = await analyzeProperty(property);

    analysisResults[req.params.id] = result;

    res.json(result);
  } catch (err) {
    const fallback = {
      fraud_probability: 80,
      risk_level: "High",
      reasons: ["Fallback triggered"]
    };

    analysisResults[req.params.id] = fallback;

    res.json(fallback);
  }
};

exports.getAnalysis = (req, res) => {
  res.json(analysisResults[req.params.id] || {});
};