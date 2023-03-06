"use strict";

const models = require("../models");

const productController = {};

productController.show = async (req, res) => {
    const categoryId = parseInt(req.query.category) || 0;

    const categories = await models.Category.findAll({
        attributes: ['id', 'name', 'imagePath'],
        include: [{ model: models.Product }],
    });
    res.locals.categories = categories;

    const option = {
        attributes: ['id', 'name', 'imagePath', 'stars', 'oldPrice', 'price'],
        where: {},
    };

    if (categoryId > 0) {
        option.where = {categoryId};
    }

    const products = await models.Product.findAll(option);
    res.locals.products = products;

    res.render("product-list");
};

module.exports = productController;