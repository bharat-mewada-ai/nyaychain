const data = require('../data/seed.json');
const { analyzeProperty } = require('../services/geminiService');

exports.runAnalysis = async (req, res) => {
  try {
    const property = data.find(p => p.propertyId === req.params.id);
    if (!property) return res.status(404).json({ error: "Not found" });

    const result = await analyzeProperty(property);
    res.json(result);
  } catch (err) {
    res.json({
      fraud_probability: 80,
      risk_level: "High",
      reasons: ["Fallback triggered"]
    });
  }
};