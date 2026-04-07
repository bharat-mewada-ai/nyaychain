const express = require('express');
const router = express.Router();

router.post('/:id', (req, res) => {
  res.json({ message: "Analysis working" });
});

module.exports = router;