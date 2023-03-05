"use strict";

const fileExists = require("../util/checkFileExists");
const models = require("../models");

const controller = {};

controller.showHomePage = async (req, res) => {
  const Brands = models.Brand;
  const Categories = models.Category;

  const listBrands = await Brands.findAll();

  //categoryArray: [1, 2, 3, 4] => [[1], [3, 4], [2]]
  const categoryArray = await Categories.findAll();
  const secondCategoryArray = categoryArray.splice(2, 2);
  const thirdCategoryArray = categoryArray.splice(1, 1);
  res.locals.formattedCategoryArray = [
    categoryArray,
    secondCategoryArray,
    thirdCategoryArray,
  ];

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
