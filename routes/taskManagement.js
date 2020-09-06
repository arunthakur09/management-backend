var taskModel = require("../models/taskManagement.js");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");
var uuid = require("uuid");

module.exports = {
    addTask: function (req, res, next) {
        const data = {
            guid: uuid.v4(),
            userId: req.body.userId,
            projectId: req.body.projectId,
            taskName: req.body.taskName,
            taskDetails: req.body.taskDetails,
            deadlineDate: req.body.deadlineDate,
            deadlineTime: req.body.deadlineTime,
            spendingHours: req.body.spendingHours,
            workedOn: req.body.workedOn,
            isActive: 1
        };
        taskModel
            .addTask(data)
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

    getTask: function (req, res, next) {
        taskModel
            .getTask({
                id: req.params.id,
                month: req.query.month ? req.query.month : "",
                taskName: req.query.taskName ? req.query.taskName : ''
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

    editTask: function (req, res, next) {
        taskModel
            .editTask({
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
    deleteTask: function (req, res, next) {
        if (!req.params.id) {
            res.statusCode = config.badRequest;
            return res.json({ result: appResource.badRequest });
        }
        taskModel
            .deleteTask({ id: req.params.id })
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
