const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/analysisController');

router.post('/:id', ctrl.runAnalysis);
router.get('/:id', ctrl.getAnalysis);

module.exports = router;