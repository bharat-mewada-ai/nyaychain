const { verifyLedger } = require('../services/hashService');

let ledger = [];

exports.getLedger = (req, res) => {
  res.json(ledger);
};

exports.verify = (req, res) => {
  const valid = verifyLedger(ledger);
  res.json({ valid });
};