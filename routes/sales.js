var salesModel = require("../models/sales.js");
var discussionModel = require("../models/discussion.js");
var submissionModel = require("../models/proposalsubmission.js");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");
var uuid = require("uuid");

module.exports = {
  getsalesTarget: async function (req, res, next) {
    if (req.query.timeperiod == "yearlysalesTarget") {
      const yearlysalesTarget = await salesModel.yearlysalesTarget({
        timeperiod: req.query.timeperiod ? req.query.timeperiod : "",
        id: req.user.roleId == 3 ? req.user.id : (req.params.userId ? parseInt(req.params.userId) : ""),
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
    }
    else {
      salesModel
        .getsalesTarget({
          id: req.user.roleId == 3 ? req.user.id : (req.params.userId ? parseInt(req.params.userId) : ""),
          timeperiod: req.query.timeperiod ? req.query.timeperiod : ""
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
    }
  },
  addsalesTarget: function (req, res, next) {
    const data = {
      guid: uuid.v4(),
      userId: req.body.userId,
      employeeTarget: req.body.employeeTarget,
      isActive: 1
    };
    salesModel
      .addsalesTarget(data)
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
  getTarget: function (req, res, next) {
    salesModel
      .getTarget({ id: req.params.id })
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
  editTarget: function (req, res, next) {
    salesModel
      .editTarget({
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
};
