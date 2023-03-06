"use strict";

const models = require("../models");

const productController = {};

productController.show = async (req, res) => {
    const categoryId = parseInt(req.query.category) || 0;
    const brandId = parseInt(req.query.brand) || 0;
    const tagId = parseInt(req.query.tag) || 0;

    const categories = await models.Category.findAll({
        attributes: ['id', 'name', 'imagePath'],
        include: [{ model: models.Product }],
    });
    res.locals.categories = categories;

    const brands = await models.Brand.findAll({
        attributes: ['id', 'name', 'imagePath'],
        include: [{ model: models.Product }],
    });
    res.locals.brands = brands;

    const tags = await models.Tag.findAll({
        attributes: ['id', 'name'],
    });
    res.locals.tags = tags;

    const option = {
        attributes: ['id', 'name', 'imagePath', 'stars', 'oldPrice', 'price'],
        where: {},
        include: [],
    };

    if (categoryId > 0) {
        option.where = {categoryId};
    }

    if (brandId > 0) {
        option.where = {brandId};
    }

    if (tagId > 0) {
        option.include = [{
            model: models.Tag,
            where: {id: tagId},
            attributes: []
        }];
    }

    const products = await models.Product.findAll(option);
    res.locals.products = products;

    res.render("product-list");
};

module.exports = productController;