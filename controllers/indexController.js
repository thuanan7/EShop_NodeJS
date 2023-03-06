"use strict";

const fileExists = require("../util/checkFileExists");
const models = require("../models");

const controller = {};

controller.showHomePage = async (req, res) => {
  const Brands = models.Brand;
  const Categories = models.Category;
  const Products = models.Product;

  //categoryArray: [1, 2, 3, 4] => [[1], [3, 4], [2]]
  const categoryArray = await Categories.findAll();
  const secondCategoryArray = categoryArray.splice(2, 2);
  const thirdCategoryArray = categoryArray.splice(1, 1);
  res.locals.formattedCategoryArray = [
    categoryArray,
    secondCategoryArray,
    thirdCategoryArray,
  ];

  const recentProducts = await Products.findAll({
    attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice', 'updatedAt'],
    order: [['updatedAt', 'DESC']],
    limit: 10,
  });

  const featuredProducts = await Products.findAll({
    attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice'],
    order: [['stars', 'DESC']],
    limit: 10,
  });

  const listBrands = await Brands.findAll();
  res.render("index", {listBrands, featuredProducts, recentProducts});
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
