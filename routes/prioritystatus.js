var statusModel = require("../models/prioritystatus");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");
var uuid = require("uuid");
var fs = require("fs");
const multer = require("multer");
const csv = require("fast-csv");

module.exports = {
  addstatus: function (req, res, next) {
    if (
      !req.body.userId ||
      !req.body.clientName ||
      !req.body.date ||
      !req.body.task ||
      !req.body.workhours
    ) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    var data = {
      userId: req.body.userId,
      clientName: req.body.clientName,
      date: req.body.date,
      task: req.body.task,
      workhours: req.body.workhours,
      isActive: 1
    };
    statusModel
      .addstatus(data)
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

  getstatus: function (req, res, next) {
    statusModel
      .getstatus({ id: req.params.userId })
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
  editstatus: function (req, res, next) {
    if (
      !req.body.clientName ||
      !req.body.date ||
      !req.body.task ||
      !req.body.workhours
    ) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }

    statusModel
      .editstatus({
        ...req.body,
        id: parseInt(req.params.id)
      })
      .then(
        function (result) {
          return res.json({ result: appResource.success, data: result });
        },
        function (err) {
          console.log("errr", err);
          res.statusCode = config.serverError;
          return res.json({
            result: appResource.serverError,
            statusText: "error"
          });
        }
      )
      .fail(logger.handleError);
  },
  deletestatus: function (req, res, next) {
    statusModel
      .deletestatus({ id: req.params.id })
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

  gethoursRecord: async function (req, res, next) {
    const getRecord = await statusModel.getmonthlystatus({
      id: req.params.userId
    });
    var result = getRecord.map(key => ({
      workhours: key.workhours
    }));

    var Totalhours = getRecord.reduce(function (prev, cur) {
      return prev + cur.workhours;
    }, 0);

    var hours = 400;
    var percentage = (Totalhours / hours) * 100;

    var monthlyRecords = [];
    monthlyRecords.push({
      Totalhours,
      percentage
    });
    res.json({
      result,
      monthlyRecords
    });
  },
  getcsv: async function (req, res, next) {

  }
};
