'use strict';

var utils = require('../utils/writer.js');
var Order = require('../service/OrderService');

module.exports.delete_order = function delete_order (req, res, next, id) {
  Order.delete_order(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.get_order = function get_order (req, res, next, id) {
  Order.get_order(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.new_order = function new_order (req, res, next) {
  Order.new_order()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.update_order = function update_order (req, res, next, body, id) {
  Order.update_order(body, id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
