"use strict";

const models = require("../models");

const productController = {};

productController.show = async (req, res) => {
    const products = await models.Product.findAll();
    res.render("product-list", {products});
};

module.exports = productController;