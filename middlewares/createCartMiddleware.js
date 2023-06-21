'use strict';

module.exports = (req, res , next) => {
    const Cart = require('../controllers/cart');
    req.session.cart = new Cart(req.session.cart ? req.session.cart : {});
    res.locals.quantity = req.session.cart.quantity;
    next();
}