"use strict";
const models = require("../models");

const cartController = {};

// api [POST] {id, quantity}
cartController.add = async (req, res) => {
	const id = parseInt(req.body.id) || 0;
	const quantity = parseInt(req.body.quantity) || 0;
	const product = await models.Product.findByPk(id);
	if (product) {
		req.session.cart.add(product, quantity);
	}
	return res.json({ quantity: req.session.cart.quantity });
};

//[GET] /cart
cartController.show = (req, res) => {
	res.locals.cart = req.session.cart.getCart();
	res.render("cart");
};

// api [PUT] /cart {id, quantity}
cartController.update = async (req, res) => {
	const id = parseInt(req.body.id) || 0;
	const quantity = parseInt(req.body.quantity) || 0;

	if (quantity > 0) {
		const updateItem = req.session.cart.update(id, quantity);
		if (updateItem) {
			return res.json({
				total: updateItem.total,
				subtotal: req.session.cart.subtotal,
				grandtotal: req.session.cart.total,
				quantity: req.session.cart.quantity,
			});
		}
	}

	return res.status(204).send();
};

// [DELETE] /cart {id}
cartController.remove = (req, res) => {
	const id = parseInt(req.body.id) || 0;
	req.session.cart.remove(id);
	return res.json({
		subtotal: req.session.cart.subtotal,
		grandtotal: req.session.cart.total,
		quantity: req.session.cart.quantity,
	});
};

// [DELETE] /cart/clear
cartController.clear = async (req, res) => {
	req.session.cart.clear();
	return res.status(204).send();
};

module.exports = cartController;
