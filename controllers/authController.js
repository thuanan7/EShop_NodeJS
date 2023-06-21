"use strict";

const controller = {};
const passport = require("./passport");

controller.show = (req, res) => {
	res.render("login", { loginMessage: req.flash("loginMessage") });
};

controller.login = (req, res, next) => {
	let keepSingedIn = req.body.keepSignedIn;
    let cart = req.session.cart;
    let redirectTo = req.session.redirectTo ? req.session.redirectTo : "/users/my-account";
	passport.authenticate("local-login", (error, user) => {
		if (error) {
			return next(error);
		}
		if (!user) {
			return res.redirect("/users/login");
		}
		req.logIn(user, (error) => {
			if (error) {
				return next(error);
			}
			req.session.cookie.maxAge = keepSingedIn
				? 24 * 60 * 60 * 1000
				: null;
            req.session.cart = cart;

			return res.redirect(redirectTo);
		});
	})(req, res, next);
};

controller.logout = (req, res, next) => {
    let cart = req.session.cart;
	req.logout((error) => {
		if (error) {
			return next(error);
		}
        req.session.cart = cart;
        res.redirect("/");
	});
};

controller.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    req.session.redirectTo = req.originalUrl;
    res.redirect("/users/login");
}

module.exports = controller;
