"use strict";
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { body, getErrorMessage } = require("../controllers/validator");

router.get("/login", authController.show);
router.post(
	"/login",
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email is required!")
		.isEmail()
		.withMessage("Invalid email address!"),
	body("password").trim().notEmpty().withMessage("Password is required!"),
	(req, res, next) => {
		let message = getErrorMessage(req);
		if (message) {
			return res.render("login", {
				loginMessage: message,
			});
		}
		next();
	},
	authController.login
);

router.get("/logout", authController.logout);

router.post(
	"/register",
	body("firstName").trim().notEmpty().withMessage("First Name is required!"),
	body("lastName").trim().notEmpty().withMessage("Last Name is required!"),
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email is required!")
		.isEmail()
		.withMessage("Invalid Email Address!"),
	body("mobile").trim().notEmpty().withMessage("Phone number is required!"),
	body("password").trim().notEmpty().withMessage("Password is required!"),
	body("password")
		.matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
		.withMessage(
			"Password must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"
		),
	body("confirmPassword")
		.custom((confirmPassword, { req }) => {
			return confirmPassword == req.body.password;
		})
		.withMessage("Confirm password not match!"),
	(req, res, next) => {
		let message = getErrorMessage(req);
		if (message) {
			return res.render("login", {
				registerMessage: message,
			});
		}
		next();
	},
	authController.register
);

router.get("/forgot", authController.showForgotPassword);
router.post(
	"/forgot",
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email is required!")
		.isEmail()
		.withMessage("Invalid Email Address!"),

	(req, res, next) => {
		let message = getErrorMessage(req);
		if (message) {
			return res.render("forgot-password", {
				message,
			});
		}
		next();
	},
	authController.forgotPassword
);

router.get("/reset", authController.showResetPassword);
router.post(
	"/reset",
	body("password").trim().notEmpty().withMessage("Password is required!"),
	body("password")
		.matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
		.withMessage(
			"Password must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"
		),
	body("confirmPassword")
		.custom((confirmPassword, { req }) => {
			return confirmPassword == req.body.password;
		})
		.withMessage("Confirm password not match!"),
	(req, res, next) => {
		let message = getErrorMessage(req);
		if (message) {
			return res.render("reset-password", {
				message,
			});
		}
		next();
	},
	authController.resetPassword
);

module.exports = router;
