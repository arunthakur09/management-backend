var announcementModel = require("../models/announcement.js");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");

module.exports = {
  addannouncements: function (req, res) {
    if (
      !req.body.title ||
      !req.body.subtitle ||
      !req.body.location ||
      !req.body.expiryDate ||
      !req.body.notifyAllEmployees ||
      !req.body.notifyAnyOthers
    ) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    const data = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      location: req.body.location,
      expiryDate: req.body.expiryDate,
      notifyAllEmployees: req.body.notifyAllEmployees,
      notifyAnyOthers: req.body.notifyAnyOthers,
      isActive: 1
    };
    announcementModel
      .addannouncements(data)
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
  getannouncements: function (req, res, next) {
    announcementModel
      .getannouncements({ id: req.params.id })
      .then(
        function (result) {
          return res.json({ result: appResource.success, data: result });
          //res.render("department", { result: result });
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

  editannouncements: function (req, res, next) {
    if (
      !req.body.title ||
      !req.body.subtitle ||
      !req.body.location ||
      !req.body.expiryDate ||
      !req.body.notifyAllEmployees ||
      !req.body.notifyAnyOthers
    ) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    announcementModel
      .editannouncements({
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
  deleteannouncements: function (req, res, next) {
    if (!req.params.id) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    announcementModel
      .deleteannouncements({ id: req.params.id })
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
