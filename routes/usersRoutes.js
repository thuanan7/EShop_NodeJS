"use strict";
const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.get('/checkout', usersController.checkout);
router.post('/placeorders', usersController.placeOrders);

module.exports = router;