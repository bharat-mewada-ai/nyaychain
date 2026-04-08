const { ledger } = require('../services/ledgerStore');

exports.getLedger = (req, res) => {
  const propertyId = req.params.id;

  const filtered = ledger.filter(
    entry => entry.data.propertyId === propertyId
  );

  res.json(filtered);
};