"use strict";
const models = require("../models");

const usersController = {};

// [GET] /users/checkout
usersController.checkout = async (req, res) => {
	if (!req.session.cart.quantity) return res.redirect("/products");
	const userId = req.user.id; // co duoc tu passport da luu user vao req.user sau khi dang nhap thanh cong
	res.locals.cart = req.session.cart.getCart();
	res.locals.addresses = await models.Address.findAll({ where: { userId } });
	res.render("checkout");
};

// [POST] /users/placeorders
usersController.placeOrders = async (req, res) => {
	const userId = req.user.id;
	const addressId = req.body.addressId;
	let address = await models.Address.findByPk(addressId);
	if (!address) {
		address = await models.Address.create({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			mobile: req.body.mobile,
			address: req.body.address,
			country: req.body.country,
			city: req.body.city,
			state: req.body.state,
			zipCode: req.body.zipCode,
            isDefault: req.body.isDefault,
			userId,
		});
	}

	const paymentMethod = req.body.payment;
	const Cart = req.session.cart;
	Cart.paymentMethod = paymentMethod;
	Cart.shippingAddress = `${address.dataValues.address}, ${address.dataValues.city}, ${address.dataValues.country}`;

	switch (paymentMethod) {
		case "PAYPAL":
			saveOrders(req, res, "PAID");
			break;
		case "COD":
			saveOrders(req, res, "UNPAID");
			break;
	}

    Cart.clear();
	res.render("error", { message: "Thank you for your order!" });
};

async function saveOrders(req, res, status) {
	const userId = req.user.id;
	const cart = req.session.cart.getCart();
	const order = await models.Order.create({
		quantity: cart.quantity,
		total: cart.total,
		subtotal: cart.subtotal,
		shipping: cart.shipping,
		discount: cart.discount,
		couponCode: cart.couponCode,
		shippingAddress: cart.shippingAddress,
		paymentMethod: cart.paymentMethod,
		paymentDetails: cart.paymentDetails,
		status,
		userId,
	});

	const orderDetails = [];
	for (const item of cart.items) {
		orderDetails.push({
			orderId: order.dataValues.id,
			productId: item.product.id,
			price: item.product.price,
			quantity: item.quantity,
			total: item.total,
		});
	}

	await models.OrderDetail.bulkCreate(orderDetails);
}

module.exports = usersController;
