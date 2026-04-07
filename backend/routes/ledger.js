const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ledgerController');

router.get('/:id', ctrl.getLedger);
router.get('/:id/verify', ctrl.verify);

module.exports = router;