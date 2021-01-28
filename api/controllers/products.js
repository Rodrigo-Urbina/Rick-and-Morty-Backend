const Product = require("../models/products");

module.exports = {
  getAllProducts,
  postProduct,
  updateProduct,
  deleteProduct,
};

async function getAllProducts() {
  const products = await Product.find();
  return products;
}

async function postProduct(product) {
  const savedProduct = await product.save();
  return savedProduct;
}

async function updateProduct(name, body) {
  const product = await Product.findOneAndUpdate(
    { name: name },
    { $set: body }
  );
  return product;
}

async function deleteProduct(name) {
  const product = await Product.findOneAndDelete({ name: name });
  return product;
}
