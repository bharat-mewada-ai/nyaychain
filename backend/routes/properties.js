const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/propertycontroller');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', ctrl.create); // ✅ FIXED
router.post('/:id/transfer', ctrl.transfer);

module.exports = router;