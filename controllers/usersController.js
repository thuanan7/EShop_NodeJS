'use strict';
const models = require('../models');

const usersController = {};

usersController.checkout = async (req, res) => {
    if (!req.session.cart.quantity)
        return res.redirect('/products');
    const userId = 1;
    res.locals.cart = req.session.cart.getCart();
    res.locals.addresses = await models.Address.findAll({where: {userId}});
    res.render('checkout');
}

module.exports = usersController;