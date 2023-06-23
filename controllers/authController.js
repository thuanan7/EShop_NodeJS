"use strict";

const controller = {};
const passport = require("./passport");
const models = require("../models");
const bcrypt = require("bcrypt");

controller.show = (req, res) => {
	res.render("login", {
		loginMessage: req.flash("loginMessage"),
		registerMessage: req.flash("registerMessage"),
	});
};

controller.login = (req, res, next) => {
	let keepSingedIn = req.body.keepSignedIn;
	let cart = req.session.cart;
	let redirectTo = req.session.redirectTo
		? req.session.redirectTo
		: "/users/my-account";
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
};

controller.register = (req, res, next) => {
	let cart = req.session.cart;
	let redirectTo = req.session.redirectTo
		? req.session.redirectTo
		: "/users/my-account";
	passport.authenticate("local-register", (error, user) => {
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

			req.session.cart = cart;
			return res.redirect(redirectTo);
		});
	})(req, res, next);
};

controller.showForgotPassword = (req, res) => {
	res.render("forgot-password");
};

controller.forgotPassword = async (req, res) => {
	const email = req.body.email;

	//Kiem tra neu email ton tai
	const user = await models.User.findOne({ where: { email } });
	if (user) {
		//Tao link
		const { sign } = require("./jwt");
		const token = sign(email);
		const host = req.header("host");
		const resetLink = `${req.protocol}://${host}/users/reset?token=${token}&email=${email}`;

		// Gui mail
		const mail = require("./mail");
		mail.sendForgotPasswordMail(user, host, resetLink)
			.then((result) => {
				//Thong bao thanh cong
				console.log("email has been sent");
				return res.render("forgot-password", { done: true });
			})
			.catch((error) => {
				//Thong bao neu co error
				console.log(error.statusCode);
				return res.render("forgot-password", {
					message:
						"An error occurred when sending to your email. Please your email address!",
				});
			});
	} else {
		//nguoc lai, thong bao email khong ton tai
		return res.render("forgot-password", {
			message: "Email does not exist!",
		});
	}
};

controller.showResetPassword = (req, res) => {
	const email = req.query.email;
	const token = req.query.token;
	let { verify } = require("./jwt");
	if (!token || !verify(token)) {
		return res.render("reset-password", { expired: true });
	} else {
		return res.render("reset-password", { email, token });
	}
};

controller.resetPassword = async (req, res) => {
	let email = req.body.email;
	let token = req.body.token;
	let password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));

	let { verify } = require("./jwt");
	if (!token || !verify(token)) {
		return res.render("reset-password", { expired: true });
	} else {
		await models.User.update({ password }, { where: { email } });
		return res.render("reset-password", { done: true });
	}
};

module.exports = controller;
