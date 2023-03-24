"use strict";

const models = require("../models");
const sequelize = require("sequelize");
const Op = sequelize.Op;

const productController = {};

productController.show = async (req, res) => {
	const categoryId = parseInt(req.query.category) || 0;
	const brandId = parseInt(req.query.brand) || 0;
	const tagId = parseInt(req.query.tag) || 0;
	const keyword = req.query.keyword || "";
	let _sort = req.query._sort || "price";
	let page = isNaN(req.query.page)
		? 1
		: Math.max(1, parseInt(req.query.page));

	const option = {
		attributes: [
			"id",
			"name",
			"imagePath",
			"stars",
			"oldPrice",
			"price",
			"createdAt",
			"updatedAt",
		],
		where: {},
		include: [],
	};

	if (categoryId > 0) {
		option.where.categoryId = categoryId;
	}

	if (brandId > 0) {
		option.where.brandId = brandId;
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

	if (keyword.trim() != "") {
		option.where.name = {
			[Op.iLike]: `%${keyword.trim()}%`,
		};
	}

	switch (_sort) {
		case "newest":
			option.order = [["createdAt", "DESC"]];
			break;
		case "popular":
			option.order = [["stars", "DESC"]];
			break;
		default:
			_sort = "price";
			option.order = [["price", "ASC"]];
	}
	res.locals._sort = _sort;

	const limit = 6;
	option.limit = limit;
	option.offset = limit * (page - 1);

	const { rows, count } = await models.Product.findAndCountAll(option);

	res.locals.pagination = {
		page,
		limit,
		totalRows: count,
		queryParams: req.query
	};


	res.locals.products = rows;
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
			{
				model: models.Tag,
				attributes: ["id"],
			}
		],
	});
	
	const tagsId = [];
	product.dataValues.Tags.forEach(tag => tagsId.push(tag.dataValues.id));
	
	const relatedProducts = await models.Product.findAll({
		include: [
			{
				model: models.Tag,
				where: {
					id: {
						[Op.in]: tagsId
					}
				},
				attributes: []
			}
		],
		attributes: ["id", "name", "imagePath", "price", "oldPrice", "stars"],
		limit: 10,
	});
	res.locals.relatedProducts = relatedProducts;

	res.render("product-detail", { product });
};

module.exports = productController;
