var departmentModel = require("../models/department.js");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");
var uuid = require("uuid");

module.exports = {
  addDepartment: function (req, res, next) {
    if (
      !req.body.departmentName ||
      !req.body.shortCode ||
      !req.body.isActive ||
      !req.body.kra
    ) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    const data = {
      guid: uuid.v4(),
      departmentName: req.body.departmentName,
      shortCode: req.body.shortCode,
      kra: req.body.kra,
      isActive: 1
    };

    departmentModel
      .addDepartment(data)
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

  // getDepartment: function(req, res, next) {
  //   if (!req.params.id) {
  //     res.statusCode = config.badRequest;
  //     return res.json({ result: appResource.badRequest });
  //   }

  //   departmentModel
  //     .getDepartment({ id: req.params.id })
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

  getDepartments: function (req, res, next) {
    departmentModel
      .getDepartments({ id: req.params.id })
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

  editDepartment: function (req, res, next) {
    if (
      !req.params.id ||
      !req.body.departmentName ||
      !req.body.shortCode ||
      !req.body.kra
    ) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }

    departmentModel
      .editDepartment({
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
  deleteDepartment: function (req, res, next) {
    if (!req.params.id) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    departmentModel
      .deleteDepartment({ id: req.params.id })
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
