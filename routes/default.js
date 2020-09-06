var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");

module.exports = {
  index: function (req, res) {
    res.statusCode = config.ok;
    // return res.redirect("/api-docs/");
    // return res.json({ result: appResource.success, data : { msg: 'API is working', APIUrl: '/api/' } });
  },
  notFound: function (req, res) {
    res.statusCode = config.notFound;
    // return res.redirect("/api-docs/");
    // return res.json({ result: appResource.notFound }); 
  }
};
