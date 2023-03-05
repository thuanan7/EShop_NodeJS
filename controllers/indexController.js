"use strict";

const fileExists = require("../util/checkFileExists");
const models = require("../models");

const controller = {};

controller.showHomePage = async (req, res) => {
  const Brands = models.Brand;
  const listBrands = await Brands.findAll();
  res.render("index", {listBrands});
};

controller.showPage = (req, res, next) => {
  const page = req.params.page;
  console.log("page:" + page);
  const filePath = __dirname + "/../views/" + page + ".hbs";
  if (fileExists(filePath)) return res.render(page);
  next();

  // const pages = ['cart', 'checkout', 'contact', 'index', 'login',
  //   'my-account', 'product-detail', 'product-list', 'wishlist'
  // ];
  // if (pages.includes(req.params.page))
  //   return res.render(req.params.page);
  //   next();
};

module.exports = controller;
