var subperformanceModel = require("../models/subPerformanceMatrix");
var performanceModel = require("../models/performanceMatrix");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");
const uuid = require("uuid/v4");

module.exports = {
  addsubperformance: function (req, res, next) {
    // if (!req.body.name || !req.body.parentId) {
    //   res.statusCode = config.badRequest;
    //   return res.json({ result: appResource.badRequest });
    // }
    var data = {
      name: req.body.name,
      isActive: 1,
      guid: uuid.v4(),
      parentId: parseInt(req.body.parentId)
    };
    subperformanceModel
      .addperformance(data)
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
  getsubperformances: function (req, res, next) {
    subperformanceModel
      .getsubperformances({ id: req.params.id })
      .then(
        function (result) {
          return res.json({ result: appResource.success, data: result });
          //res.render("submatrix", { result: result });
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
  // getsubperformance: function(req, res, next) {
  //   if (!req.params.id) {
  //     res.statusCode = config.badRequest;
  //     return res.json({ result: appResource.badRequest });
  //   }
  //   subperformanceModel
  //     .getsubperformance({ id: req.params.id })
  //     .then(
  //       function(result) {
  //         return res.json({ result: appResource.success, data: result });
  //       },
  //       function(err) {
  //         res.statusCode = config.serverError;
  //         return res.json({
  //           result: appResource.serverError,
  //           statusText: "error"
  //         });
  //       }
  //     )
  //     .fail(logger.handleError);
  // },
  deletesubperformance: function (req, res, next) {
    if (!req.params.id) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    subperformanceModel
      .deletesubperformance({ id: req.params.id })
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
  editsubPerformance: function (req, res, next) {
    if (!req.params.id || !req.body.name || !req.body.parentId) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    subperformanceModel
      .editsubPerformance({
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
  }
};
