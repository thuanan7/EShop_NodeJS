"use strict";

const models = require("../models");

const productController = {};

productController.getData = async (req, res, next) => {
	const categories = await models.Category.findAll({
		attributes: ["id", "name", "imagePath"],
		include: [{ model: models.Product }],
	});
	res.locals.categories = categories;

	const brands = await models.Brand.findAll({
		attributes: ["id", "name", "imagePath"],
		include: [{ model: models.Product }],
	});
	res.locals.brands = brands;

	const tags = await models.Tag.findAll({
		attributes: ["id", "name"],
	});
	res.locals.tags = tags;
    next();
};

productController.show = async (req, res) => {
	const categoryId = parseInt(req.query.category) || 0;
	const brandId = parseInt(req.query.brand) || 0;
	const tagId = parseInt(req.query.tag) || 0;

	const option = {
		attributes: ["id", "name", "imagePath", "stars", "oldPrice", "price"],
		where: {},
		include: [],
	};

	if (categoryId > 0) {
		option.where = { categoryId };
	}

	if (brandId > 0) {
		option.where = { brandId };
	}

	if (tagId > 0) {
		option.include = [
			{
				model: models.Tag,
				where: { id: tagId },
				attributes: [],
			},
		];
	}

	const products = await models.Product.findAll(option);
	res.locals.products = products;

	res.render("product-list");
};

productController.detail = async (req, res) => {
	const productId = parseInt(req.params.id) || 0;

	const product = await models.Product.findOne({
		where: { id: productId },
		include: [
			{
				model: models.Image,
				attributes: ["name", "imagePath"],
			},
			{
				model: models.Review,
				include: [
					{
						model: models.User,
						attributes: ["firstName", "lastName"],
					},
				],
				attributes: ["review", "stars", "updatedAt"],
			},
		],
	});

	res.render("product-detail", { product });
};

module.exports = productController;
