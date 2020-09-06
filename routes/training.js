var trainingModel = require("../models/training.js");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");
var uuid = require("uuid");

module.exports = {
  addtrainingSyllabus: function (req, res, next) {
    if (!req.body.type || !req.body.syllabus) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    const data = {
      type: req.body.type,
      syllabus: req.body.syllabus,
      isActive: 1
    };
    trainingModel
      .addtrainingSyllabus(data)
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
  getTrainingSyllabus: function (req, res, next) {
    trainingModel
      .getTrainingSyllabus({ id: req.params.id })
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
  editTrainingSyllabus: function (req, res, next) {
    if (
      !req.params.id ||
      !req.body.type ||
      !req.body.syllabus ||
      !req.body.isActive
    ) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }

    trainingModel
      .editTrainingSyllabus({
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
  deleteTrainingSyllabus: function (req, res, next) {
    if (!req.params.id) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }

    trainingModel
      .deleteTrainingSyllabus({ id: req.params.id })
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

  addSyllabusResponse: function (req, res, next) {
    if (!req.body.userId || !req.body.syllabusId) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    const data = {
      userId: req.body.userId,
      syllabusId: req.body.syllabusId,
      isActive: 1
    };
    trainingModel
      .addSyllabusResponse(data)
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
  getSyllabusResponse: async function (req, res, next) {
    const trainingdata = await trainingModel.getTrainingSyllabus();
    console.log("Training Data", trainingdata);
    const userData = await trainingModel.getSyllabusResponse();
    let grouping = {};
    userData.forEach(function (el, index) {
      grouping[el.syllabusId] = trainingdata.filter(function (sel) {
        return sel.id == el.syllabusId;
      });
    });
    return res.json({
      result: appResource.success,
      data: {
        grouping
      }
    });
  }
};
