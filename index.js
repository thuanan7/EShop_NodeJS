"use strict";

const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const expressHandlebars = require("express-handlebars");
const helper = require("./util/handlebarsHelper");

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
    },
  })
);

app.set("view engine", "hbs");


// routes
app.use("/products", require("./routes/productRoutes"));
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
