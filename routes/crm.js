var CRMmodel = require("../models/crm.js");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");
var uuid = require("uuid");

module.exports = {
  addcrmFields: function (req, res, next) {
    if (
      !req.body.userId ||
      !req.body.clientName ||
      !req.body.profile ||
      !req.body.portal ||
      !req.body.date
    ) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    const data = {
      userId: req.body.userId,
      clientName: req.body.clientName,
      profile: req.body.profile,
      portal: req.body.portal,
      source: req.body.source,
      date: req.body.date,
      isActive: 1
    };

    CRMmodel.addcrmFields(data)
      .then(
        function (result) {
          return res.json({
            result: appResource.success,
            data: { locationID: result.insertId }
          });
        },
        function (err) {
          res.statusCode = config.serverError;
          return res.json({
            result: appResource.serverError,
            statusText: "error"
          });
        }
      )
      .fail(logger.handleError);
  },

  getcrmFields: function (req, res, next) {
    CRMmodel.getcrmFields({ id: req.params.id })
      .then(
        function (result) {
          return res.json({ result: appResource.success, data: result });
        },
        function (err) {
          res.statusCode = config.serverError;
          return res.json({
            result: appResource.serverError,
            statusText: "error"
          });
        }
      )
      .fail(logger.handleError);
  },

  editcrmFields: function (req, res, next) {
    if (
      !req.body.userId ||
      !req.body.clientName ||
      !req.body.profile ||
      !req.body.portal ||
      !req.body.source ||
      !req.body.date
    ) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }

    CRMmodel.editcrmFields({
      ...req.body,
      id: parseInt(req.params.id)
    })
      .then(
        function (result) {
          return res.json({ result: appResource.success, data: result });
        },
        function (err) {

          res.statusCode = config.serverError;
          return res.json({
            result: appResource.serverError,
            statusText: "error"
          });
        }
      )
      .fail(logger.handleError);
  },
  deletecrmFields: function (req, res, next) {
    if (!req.params.id) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }

    CRMmodel.deletecrmFields({ id: req.params.id })
      .then(
        function (result) {
          return res.json({ result: appResource.success, data: result });
        },
        function (err) {
          res.statusCode = config.serverError;
          return res.json({
            result: appResource.serverError,
            statusText: "error"
          });
        }
      )
      .fail(logger.handleError);
  }
};
