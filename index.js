"use strict";
require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const expressHandlebars = require("express-handlebars");
const helper = require("./util/handlebarsHelper");
const { createPagination } = require("express-handlebars-paginate");
const session = require("express-session");
const redisStore = require("connect-redis").default;
const { createClient } = require("redis");

const redisClient = createClient({
	url: process.env.REDIS_URL,
});
redisClient.connect().catch(console.error);
const passport = require("./controllers/passport");
const flash = require("connect-flash");

// Config public static folder
app.use(express.static(__dirname + "/public"));

//Config express-handlebars
app.engine(
	"hbs",
	expressHandlebars.engine({
		layoutsDir: __dirname + "/views/layouts",
		partialsDir: __dirname + "/views/partials",
		extname: "hbs",
		defaultLayout: "layout",
		helpers: {
			displayStars: helper.displayStars,
			specifications: helper.specifications,
			formatTime: helper.formatTime,
			paginateHelper: createPagination,
		},
		runtimeOptions: {
			allowProtoPropertiesByDefault: true
		}
	})
);

app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Config express-session
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		store: new redisStore({ client: redisClient }),
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			maxAge: 20 * 60 * 1000, // 20 minutes
		},
	})
);

//Config passport
app.use(passport.initialize());
app.use(passport.session());

//Config connect-flag
app.use(flash());

// Custom middleware
app.use((req, res, next) => {
	res.locals.isLoggedIn = req.isAuthenticated();
	next();
})

// Create session cart
app.use(require("./middlewares/createCartMiddleware"));

// routes
app.use("/users", require("./routes/authRouter"), require("./routes/usersRoutes"));
app.use("/products", require("./routes/productRoutes"));
app.use("/cart", require("./routes/cartRoutes"));
app.use("/", require("./routes/indexRoutes"));

app.use((req, res, next) => {
	res.status(404).render("error", { message: "Page not Found!" });
});

app.use((error, req, res, next) => {
	console.error(error);
	res.status(500).render("error", { message: "Internal Server Error!" });
});

app.listen(port, () => {
	console.log(`server is listening on port ${port}`);
});
