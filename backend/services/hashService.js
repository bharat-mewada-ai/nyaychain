const crypto = require('crypto');

function hashEntry(previousHash, data) {
  const content = previousHash + JSON.stringify(data);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function appendToLedger(ledger, eventType, data) {
  const previous = ledger[ledger.length - 1];
  const previousHash = previous ? previous.hash : '0000000000000000';

  const hash = hashEntry(previousHash, data);

  const entry = {
    entryId: `LED-${String(ledger.length + 1).padStart(4, '0')}`,
    eventType,
    timestamp: new Date().toISOString(),
    data,
    hash,
    previousHash,
  };

  ledger.push(entry);
  return entry;
}

function verifyLedger(ledger) {
  for (let i = 1; i < ledger.length; i++) {
    const prev = ledger[i - 1];
    const curr = ledger[i];

    const recalculated = hashEntry(prev.hash, curr.data);
    if (recalculated !== curr.hash) return false;
  }
  return true;
}

module.exports = { appendToLedger, verifyLedger };