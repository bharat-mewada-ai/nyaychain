const { verifyLedger } = require('../services/hashService');

let ledger = [];

exports.getLedger = (req, res) => {
  const propertyId = req.params.id;

  const filtered = ledger.filter(l => l.data.propertyId === propertyId);

  res.json(filtered);
};

exports.verify = (req, res) => {
  const valid = verifyLedger(ledger);
  res.json({ valid });
};