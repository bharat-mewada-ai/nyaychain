const data = require('../data/seed.json');
const { ledger } = require('../services/ledgerStore');
const { appendToLedger } = require('../services/hashService');

let properties = data;

// GET all properties
exports.getAll = (req, res) => {
  res.json(properties);
};

// GET single property
exports.getOne = (req, res) => {
  const property = properties.find(p => p.propertyId === req.params.id);

  if (!property) {
    return res.status(404).json({ error: "Property not found" });
  }

  res.json(property);
};

// TRANSFER ownership
exports.transfer = (req, res) => {
  const { from, to, price } = req.body;

  // validation
  if (!from || !to || !price) {
    return res.status(400).json({ error: "Invalid transfer data" });
  }

  const property = properties.find(p => p.propertyId === req.params.id);

  if (!property) {
    return res.status(404).json({ error: "Property not found" });
  }

  // close previous owner
  const lastOwner = property.ownershipHistory[property.ownershipHistory.length - 1];
  if (lastOwner) {
    lastOwner.to = new Date().toISOString();
  }

  // update current owner
  property.currentOwner = to;

  // add new ownership record
  property.ownershipHistory.push({
    owner: to,
    from: new Date().toISOString(),
    to: null,
    price
  });

  // add to ledger
  const entry = appendToLedger(ledger, "TRANSFER", {
    from,
    to,
    price,
    propertyId: property.propertyId,
    status: "COMPLETED"
  });

  res.json({
    message: "Transfer successful",
    entry
  });
};

// ADD new property
exports.create = (req, res) => {
  const newProperty = req.body;

  // validation
  if (!newProperty.propertyId || !newProperty.currentOwner) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // prevent duplicate
  const exists = properties.find(p => p.propertyId === newProperty.propertyId);
  if (exists) {
    return res.status(400).json({ error: "Property already exists" });
  }

  properties.push(newProperty);

  res.json({
    message: "Property added successfully",
    data: newProperty
  });
};