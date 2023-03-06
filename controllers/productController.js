"use strict";

const models = require("../models");

const productController = {};

productController.show = async (req, res) => {
    const products = await models.Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'oldPrice', 'price'],
    });
    res.locals.products = products;

    res.render("product-list");
};

module.exports = productController;