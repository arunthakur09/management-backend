var leaveModule = require("../models/leaveManagement.js");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");
var uuid = require("uuid");

module.exports = {
  addLeaveManagFields: function (req, res, next) {
    console.log("req.user>>>>>>>>>", req.user)
    // if (
    //   !req.body.userId ||
    //   !req.body.leaveType ||
    //   !req.body.status ||
    //   !req.body.status ||
    //   !req.body.dateFrom ||
    //   !req.body.dateTo ||
    //   !req.body.departmentHead ||
    //   !req.body.comment
    // ) {
    //   res.statusCode = config.badRequest;
    //   return res.json({ result: appResource.badRequest });
    // }
    const data = {
      userId: req.body.userId ? req.body.userId : req.user.id,
      guid: uuid.v4(),
      leaveType: req.body.leaveType,
      dateFrom: req.body.dateFrom,
      dateTo: req.body.dateTo,
      departmentHead: req.body.departmentHead,
      reason: req.body.reason,
      leaveDuration: req.body.leaveDuration,
      shift: req.body.shift,
      leaveTime: req.body.leaveTime,
      status: 'pending',
      isActive: 1
    };
    leaveModule
      .addLeaveManagFields(data)
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
    //console.log(data)
  },
  getLeaveManagFields: async function (req, res, next) {
    console.log("REQ.QUERY>>>>>>>.", req.query)

    const yearlyleave = await leaveModule.getyearlyLeave({
      userid: req.query.userid
    })

    const getCountFields = await leaveModule.getCountFields()
    leaveModule
      .getLeaveManagFields({
        id: req.params.id,
        roleId: req.user.roleId,
        userId: req.user.id,
        userid: req.query.userid,
        status: req.query.status ? req.query.status : "",
        from: req.query.from ? req.query.from : "",
        to: req.query.to ? req.query.to : "",
        isActive: 1,
        timePeriod: req.query.timePeriod ? req.query.timePeriod : ""
      })
      .then(
        function (result) {
          return res.json({ result: appResource.success, data: result, yearlyleave: yearlyleave, getCountFields: getCountFields });
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
  editLeaveManagFields: function (req, res, next) {
    leaveModule
      .editLeaveManagFields({
        ...req.body,
        status: req.body.status,
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
  deleteLeaveManagFields: function (req, res, next) {
    if (!req.params.id) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    leaveModule
      .deleteLeaveManagFields({ id: req.params.id })
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
  addleaveRecord: function (req, res, next) {
    const data = {
      userId: req.body.userId,
      leaveType: req.body.leaveType,
      paid: req.body.paid,
      unpaid: req.body.unpaid,
      month: req.body.month,
      isActive: 1
    };
    leaveModule
      .addleaveRecord(data)
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
  getleaveRecord: function (req, res, next) {
    leaveModule
      .getleaveRecord({ id: req.params.userId })
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
