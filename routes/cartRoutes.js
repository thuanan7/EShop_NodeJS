'use strict';
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/', cartController.show);
router.post('/', cartController.add);
router.put('/', cartController.update);
router.delete('/', cartController.remove);
router.delete('/clear', cartController.clear);

module.exports = router;