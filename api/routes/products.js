const express = require("express");
const router = express.Router();

// Local Imports
const Product = require("../models/products");
const Controller = require("../controllers/products");
const checkAuth = require("../middleware/check-auth");

// Product Routes

// Get all products
router.get("/", checkAuth, async (req, res, next) => {
  const response = await Controller.getAllProducts();
  res.json(response);
});

// Register a new Product
router.post("/", checkAuth, async (req, res, next) => {
  const product = new Product(req.body);
  const savedProduct = await Controller.postProduct(product);

  res.json(savedProduct);
});

// Update user
router.patch("/:name", checkAuth, async (req, res, next) => {
  const product = await Controller.updateProduct(req.params.name, req.body);
  res.json(product);
});

// Delete user
router.delete("/:name", checkAuth, async (req, res, next) => {
  const product = await Controller.deleteProduct(req.params.name);
  res.json(product);
});

module.exports = router;
