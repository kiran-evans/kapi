'use strict';

var utils = require('../utils/writer.js');
var Product = require('../service/ProductService');

module.exports.delete_product = function delete_product (req, res, next, id) {
  Product.delete_product(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.get_products = function get_products (req, res, next, id) {
  Product.get_products(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.new_product = function new_product (req, res, next, body) {
  Product.new_product(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.update_product = function update_product (req, res, next, id) {
  Product.update_product(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
