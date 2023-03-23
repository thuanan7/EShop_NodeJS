'use strict';
const express = require('express');
const router = express.Router();
const productController = require("../controllers/productController");
const getDataMiddleware = require('../middlewares/getDataMiddleware');

router.get('/:id', getDataMiddleware, productController.detail);
router.get('/', getDataMiddleware, productController.show);

module.exports = router;