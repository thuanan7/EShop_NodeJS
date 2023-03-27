'use strict';
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/', cartController.show);
router.post('/', cartController.add);

module.exports = router;