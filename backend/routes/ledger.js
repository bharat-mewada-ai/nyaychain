const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ledgercontroller');

router.get('/:id', ctrl.getLedger);

module.exports = router;