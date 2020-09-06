var departmentModel = require("../models/department.js");
var usersModel = require("../models/users.js");
var permissionModel = require("../models/permissions.js");
var timelogmodel = require("../models/timelog");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");
var passwordHash = require("password-hash");
var uuid = require("uuid");
var configFile = require("../scripts/config.json");
var moment = require("moment");
require('moment-duration-format');
var timelogmodel = require("../models/timelog");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");
var passwordHash = require("password-hash");
var uuid = require("uuid");
var configFile = require("../scripts/config.json");
var moment = require("moment");
const mom = require('moment-timezone');
module.exports = {
  gettimelog: function (req, res, next) {
    timelogmodel
      .gettimelog({
        id: req.params.id,
        userId: req.query.userId,
        timePeriod: req.query.timePeriod,
        from: req.query.from,
        to: req.query.to
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
  todaytimelog: function (req, res, next) {
    timelogmodel
      .todaytimelog({ userId: parseInt(req.params.userId) })
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
  addtimelog: async function (req, res, next) {
    var StartTime = configFile.startTime;
    var current_date = moment(new Date()).format("YYYY-MM-DD")
    var current_time = mom().utcOffset("+05:30").format("HH:mm");
    var delayedTime =
      moment.duration(current_time).asMinutes() -
      moment.duration(StartTime).asMinutes();
    const data = {
      checkInDate: current_date,
      checkInTime: current_time,
      task: req.body.task,
      StartTime,
      delayedTime,
      checkOutTime: "",
      pauseTime: "",
      workingHour: "",
      userId: req.user.id,
      isActive: 1
    };
    const todayTimeLog = await timelogmodel.todaytimelog(data);
    if (todayTimeLog.length > 0) {
      return res.json({
        result: "You have already CheckedIn for today!",
        statusText: "error"
      });
    } else {
      timelogmodel
        .addtimelog(data)
        .then(
          async function (result) {
            const getUsers = await timelogmodel.gettimelog({
              userId: req.user.id
            });

            return res.json({
              result: "You have successfully Checked-in,Welcome back!",
              data: { getUsers, result, checkinId: result.insertId }
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
    }
  },
  editlog: async function (req, res, next) {
    // if (!req.params.userId || !req.body.checkOutDate) {
    //   res.statusCode = config.badRequest;
    //   return res.json({ result: appResource.badRequest });
    // }
    var time_out = mom().utcOffset("+05:30").format("HH:mm");
    var checkOutDate =
      moment(new Date()).format("YYYY-MM-DD");
    const data = {
      checkOutDate: checkOutDate,
      checkOutTime: time_out,
      pauseTime: req.body.pauseTime ? req.body.pauseTime : '',
      userId: parseInt(req.params.userId)
    };
    const todayTimeLog = await timelogmodel.todaytimelog(data);
    const checkoutdata = await timelogmodel.checkouttime(data);
    if (todayTimeLog.length == 0) {
      return res.json({
        result: "Please CheckIN First",
        statusText: "error"
      });
    } else {
      if (checkoutdata.length > 0) {
        return res.json({
          result: "You have already Checked Out for Today ",
          statusText: "error"
        });
      }
      data.id = todayTimeLog[0].id;
      timelogmodel
        .editlog(data)
        .then(
          async function (result) {
            const todayTimeLog = await timelogmodel.todaytimelog(data);
            var totalHour =
              moment.duration(todayTimeLog[0].checkOutTime).asMinutes() -
              moment.duration(todayTimeLog[0].checkInTime).asMinutes();
            var pause = moment.duration(todayTimeLog[0].pauseTime).asMinutes();
            var workingHour = totalHour - pause
            var totalWorkingHour = moment.duration(workingHour, "minutes").format('h:mm')
            const data2 = {
              workingHour: totalWorkingHour ? totalWorkingHour : ''
            }
            data2.id = todayTimeLog[0].id;
            const workinghours = await timelogmodel.editlog(data2)
            return res.json({ result: "Thank you for Check-out.Have a nice one.", data: result });
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
    }
  },
  checkouttime: function (req, res, next) {
    timelogmodel
      .checkouttime({ userId: parseInt(req.params.userId) })
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
  weeklytimelog: async function (req, res, next) {
    const todayTimeLog = await timelogmodel.alltimelog({
      userId: parseInt(req.params.userId)
    });

    if (req.query.parameters == "weekely") {
      let weeklytimelog = [];
      todayTimeLog.forEach(el => {
        weeklytimelog.push({ userId: el.userId, delayedTime: el.delayedTime });
      });

      var weeklydata = 0;
      weeklytimelog.forEach(function (el) {
        weeklydata += el.delayedTime;
      });

      return res.json({
        result: appResource.success,
        data: {
          weeklydata
        }
      });
    } else {
      const monthlyTimeLog = await timelogmodel.monthlytimelog({
        userId: parseInt(req.params.userId)
      });
      let monthlyRecords = [];
      monthlyTimeLog.forEach(el => {
        monthlyRecords.push({ userId: el.userId, delayedTime: el.delayedTime });
      });

      var monthlydata = 0;
      monthlyTimeLog.forEach(function (el) {
        monthlydata += el.delayedTime;
      });

      return res.json({
        result: appResource.success,
        data: {
          monthlydata
        }
      });
    }
  }

};
