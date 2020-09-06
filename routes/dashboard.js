var logger = require("../models/logger.js");
var dashboardModel = require("../models/dashboard");
var usersModel = require("../models/users.js");
var _ = require("underscore");
var Q = require("q");
module.exports = {
  dashboard: function (req, res, next) {
    res.render("dashboard.hbs");
  },
  getAttendance: async (req, res, next) => {
    const presentCount = await dashboardModel.presentCount({})
    console.log("presentcount>....", presentCount)
    dashboardModel
      .getAttendance()
      .then((result) => {
        return res.json({ result: appResource.success, data: result, presentCount: presentCount })
      })
      .catch((err) => {
        res.statusCode = config.serverError;
        return res.json({
          result: appResource.serverError,
          statusText: "error"
        });
      })
  },
  dashboard: async (req, res, next) => {
    const getDepartment = await dashboardModel.getDepartmet();
    const count = await dashboardModel.getCount();
    Total = count[0].Count + count[1].Count ? count[0].Count + count[1].Count : '0'
    womenPercentage = Math.round(count[0].Count * 100 / Total) ? Math.round(count[0].Count * 100 / Total) : '0'
    menPercentage = Math.round(count[1].Count * 100 / Total) ? Math.round(count[1].Count * 100 / Total) : '0'
    const newHire = await dashboardModel.newHire();
    const leave = await dashboardModel.getLeaves();
    const holiday = await dashboardModel.dashboardHoliday();
    const followUpDate = await dashboardModel.followUp();
    dashboardModel
      .getBirthday()
      .then((result) => {
        return res.json({
          result: appResource.success,
          data: result,
          Department: getDepartment,
          count: [{
            count: count,
            Total: Total,
            womenPercentage: womenPercentage,
            menPercentage: menPercentage
          }],
          newHire: newHire,
          leave: leave,
          holiday: holiday,
          followUpDate: followUpDate
        })
      })
      .catch((err) => {
        res.statusCode = config.serverError;
        return res.json({
          result: appResource.serverError,
          statusText: "error"
        });
      })
  }
};

