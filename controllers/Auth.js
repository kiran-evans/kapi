'use strict';

var utils = require('../utils/writer.js');
var Auth = require('../service/AuthService');

module.exports.auth = function auth (req, res, next) {
  Auth.auth()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
