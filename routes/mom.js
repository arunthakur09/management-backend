var momModel = require("../models/mom.js");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");
var uuid = require("uuid");

module.exports = {
  addmomfields: function (req, res, next) {
    if (
      !req.body.email ||
      !req.body.reasonOfMeeting ||
      !req.body.dateOfMom ||
      !req.body.durationMeeting ||
      !req.body.initiated ||
      !req.body.participants ||
      !req.body.clientName ||
      !req.body.medium ||
      !req.body.communication ||
      !req.body.clientInput ||
      !req.body.development ||
      !req.body.core ||
      !req.body.designing ||
      !req.body.hr ||
      !req.body.approved
    ) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    const data = {
      userId: req.user.id,
      guid: uuid.v4(),
      email: req.body.email,
      reasonOfMeeting: req.body.reasonOfMeeting,
      dateOfMom: req.body.dateOfMom,
      durationMeeting: req.body.durationMeeting,
      initiated: req.body.initiated,
      participants: req.body.participants,
      clientName: req.body.clientName,
      medium: req.body.medium,
      communication: req.body.communication,
      clientInput: req.body.clientInput,
      development: req.body.development,
      core: req.body.core,
      designing: req.body.designing,
      hr: req.body.hr,
      approved: req.body.approved,
      status: 'pending',
      isActive: 1
    };
    momModel
      .addmomfields(data)
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
  getmomfields: function (req, res, next) {

    momModel
      .getmomfields({
        id: req.params.guid,
        userId: req.user.id,
        roleId: req.user.roleId
      })
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
  editmomfields: function (req, res, next) {

    // if (!req.params.id || !req.body.status) {
    //   res.statusCode = config.badRequest;
    //   return res.json({ result: appResource.badRequest });
    // }
    momModel
      .editmomfields({
        email: req.body.email,
        reasonOfMeeting: req.body.reasonOfMeeting,
        dateOfMom: req.body.dateOfMom,
        durationMeeting: req.body.durationMeeting,
        initiated: req.body.initiated,
        participants: req.body.participants,
        clientName: req.body.clientName,
        medium: req.body.medium,
        communication: req.body.communication,
        clientInput: req.body.clientInput,
        development: req.body.development,
        core: req.body.core,
        designing: req.body.designing,
        hr: req.body.hr,
        approved: req.body.approved,
        status: req.user.roleId == 3 ? "pending" : req.body.status,
        isActive: 1,
        id: req.params.guid
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
  deletemomfields: function (req, res, next) {
    if (!req.params.guid) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    momModel
      .deletemomfields({ id: req.params.guid })
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
