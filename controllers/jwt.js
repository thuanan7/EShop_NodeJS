"use strict";

const jwt = require("jsonwebtoken");
const jwtSecret = "jwt secret key";

function sign(email, expiresIn = "30 minutes") {
	return jwt.sign({ email }, process.env.JWT_SECRET || jwtSecret, {
		expiresIn,
	});
}

function verify(token) {
	try {
		jwt.verify(token, process.env.JWT_SECRET || jwtSecret);
        return true;
	} catch (error) {
        return false;
    }
}

module.exports = { sign, verify };
