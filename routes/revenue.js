var revenueModel = require("../models/revenue.js");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");
var uuid = require("uuid");

module.exports = {
    addRevenues: function (req, res, next) {
        if (req.body.projectType == 'Hourly') {
            var actual = parseInt(req.body.actualRevenue)
        }
        else {
            var actual = parseInt(req.body.milestone)
        }
        const data = {
            guid: uuid.v4(),
            clientName: req.body.clientName,
            resourceId: req.body.resourceId,
            upworkId: req.body.upworkId,
            projectTitle: req.body.projectTitle,
            hourlyRate: req.body.hourlyRate,
            hours: req.body.hours,
            projectType: req.body.projectType,
            weeklyRevenue: req.body.weeklyRevenue,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            deadlineDate: req.body.deadlineDate,
            month: req.body.month,
            milestone: req.body.milestone,
            week1: req.query.week1 ? req.query.week1 : "",
            week2: req.query.week2 ? req.query.week2 : "",
            week3: req.query.week3 ? req.query.week3 : "",
            week4: req.query.week4 ? req.query.week4 : "",
            week5: req.query.week5 ? req.query.week5 : "",
            totalRevenue: req.body.totalRevenue,
            actualRevenue: actual,
            fromTo: req.body.fromTo,
            isActive: 1
        };
        revenueModel
            .addRevenues(data)
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

    getRevenues: async function (req, res, next) {
        const yearlyRevenues = await revenueModel.yearlyRevenues({})
        const totalRevenues = await revenueModel.getTotalRevenues({
            month: req.query.month
        });
        revenueModel
            .getRevenues({
                id: req.params.id,
                month: req.query.month,
                projectType: req.query.projectType,
                userId: req.user.id,
                roleId: req.user.roleId,
                timeperiod: req.query.timeperiod,
                from: req.query.from,
                to: req.query.to
            })
            .then(
                function (result) {
                    return res.json({ result: appResource.success, data: result, totalRevenues: totalRevenues, yearlyRevenues: yearlyRevenues });
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
    editRevenues: function (req, res, next) {

        var a = req.query.week1 ? req.query.week1 : req.body.week1
        var b = req.query.week2 ? req.query.week2 : req.body.week2
        var c = req.query.week3 ? req.query.week3 : req.body.week3
        var d = req.query.week4 ? req.query.week4 : req.body.week4
        var e = req.query.week5 ? req.query.week5 : req.body.week5
        if (req.body.projectType == "Hourly") {
            var actual = parseInt(a.split("|")[2]) + parseInt(b.split("|")[2]) + parseInt(c.split("|")[2]) + parseInt(d.split("|")[2]) + parseInt(e.split("|")[2])
        }
        else {
            var actual = 0
            req.body.milestone.split("|").map(e => {
                actual += parseInt(e)
            })
        }

        revenueModel
            .editRevenues({
                ...req.query,
                clientName: req.body.clientName,
                resourceId: req.body.resourceId,
                upworkId: req.body.upworkId,
                hourlyRate: req.body.hourlyRate,
                hours: req.body.hours,
                fromTo: req.body.fromTo,
                milestone: req.body.milestone,
                weeklyRevenue: req.body.weeklyRevenue,
                month: req.body.month,
                week1: req.query.week1 ? req.query.week1 : req.body.week1,
                week2: req.query.week2 ? req.query.week2 : req.body.week1,
                week3: req.query.week3 ? req.query.week3 : req.body.week3,
                week4: req.query.week4 ? req.query.week4 : req.body.week4,
                week5: req.query.week5 ? req.query.week5 : req.body.week5,
                actualRevenue: actual,
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
    deleteRevenues: function (req, res, next) {
        if (!req.params.id) {
            res.statusCode = config.badRequest;
            return res.json({ result: appResource.badRequest });
        }
        revenueModel
            .deleteRevenues({ id: req.params.id })
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