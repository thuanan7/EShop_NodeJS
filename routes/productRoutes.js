'use strict';
const express = require('express');
const router = express.Router();
const productController = require("../controllers/productController");

router.get('/:id', productController.getData, productController.detail);
router.get('/', productController.getData, productController.show);

module.exports = router;