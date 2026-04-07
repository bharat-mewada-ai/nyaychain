const data = require('../data/seed.json');
const { appendToLedger } = require('../services/hashService');

let properties = data;
let ledger = [];

exports.getAll = (req, res) => {
  res.json(properties);
};

exports.getOne = (req, res) => {
  const property = properties.find(p => p.propertyId === req.params.id);
  if (!property) return res.status(404).json({ error: "Not found" });
  res.json(property);
};

exports.transfer = (req, res) => {
  const { from, to, price } = req.body;

  const property = properties.find(p => p.propertyId === req.params.id);
  if (!property) return res.status(404).json({ error: "Not found" });

  // update property
  property.currentOwner = to;

  property.ownershipHistory.push({
    owner: to,
    from: new Date().toISOString(),
    to: null,
    price
  });

  // ledger entry
  const entry = appendToLedger(ledger, "TRANSFER", {
    from,
    to,
    price,
    propertyId: property.propertyId,
    status: "COMPLETED"
  });

  res.json({ message: "Transfer successful", entry });
};