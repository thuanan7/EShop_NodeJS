'use strict';
const models = require('../models');

const cartController = {};

// api [POST] {id, quantity}
cartController.add = async (req, res) => {
    const id = parseInt(req.body.id) || 0;
    const quantity = parseInt(req.body.quantity) || 0;
    const product = await models.Product.findByPk(id);
    if (product) {
        req.session.cart.add(product, quantity);
    }
    return res.json({quantity: req.session.cart.quantity});
};

module.exports = cartController;