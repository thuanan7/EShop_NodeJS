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
				registerMessage: message,
			});
		}
		next();
	},
	authController.login
);

router.post("/register", authController.register);

router.get("/logout", authController.logout);
module.exports = router;
