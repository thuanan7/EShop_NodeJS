"use strict";

const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const models = require("../models");

// ham xac thuc nguoi dung khi dang nhap
passport.use(
	"local-login",
	new LocalStrategy(
		{
			usernameField: "email", // ten dang nhap la email
			passwordField: "password",
			passReqToCallback: true, // cho phep truyen req vao callback de kiem tra user da dang nhap chua
		},
		async (req, email, password, done) => {
			if (email) {
				email = email.toLowerCase();
			}

			try {
				// chua dang nhap
				if (!req.user) {
					let user = await models.User.findOne({
						where: { email },
					});

                    //neu email khong dung
					if (!user) {
						return done(
							null,
							false,
							req.flash("loginMessage", "Email does not exist!")
						);
					}

					//neu mat khau khong dung
					if (!bcrypt.compareSync(password, user.password)) {
						return done(
							null,
							false,
							req.flash("loginMessage", "Invalid Password!")
						);
					}

					// cho phep dang nhap
					return done(null, user);
				}

				//bo qua dang nhap
				done(null, req.user);
			} catch (error) {
                done(error, null);
            }
		}
	)
);

// ham nay duoc goi khi xac thuc thanh cong va luu thong tin user vao session
passport.serializeUser((user, done) => {
	done(null, user.id);
});

// ham duoc goi boi passport.session de lay thong tin cua user tu csdl va dua vao req.user
passport.deserializeUser(async (id, done) => {
	try {
		let user = await models.User.findOne({
			where: {
				id,
			},
			attributes: [
				"id",
				"email",
				"firstName",
				"lastName",
				"mobile",
				"isAdmin",
			],
		});

		done(null, user);
	} catch (error) {
		done(error, null);
	}
});

module.exports = passport;
