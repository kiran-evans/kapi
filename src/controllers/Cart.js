'use strict';

var utils = require('../utils/writer.js');
var Cart = require('../service/CartService');

module.exports.get_cart = function get_cart (req, res, next, id) {
  Cart.get_cart(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.update_cart = function update_cart (req, res, next, id) {
  Cart.update_cart(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
