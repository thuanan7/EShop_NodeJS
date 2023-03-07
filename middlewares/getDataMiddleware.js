"use strict";

const models = require("../models");

module.exports = async function getData(req, res, next) {
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