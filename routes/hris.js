var hrismodel = require("../models/hris");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");
var uuid = require("uuid");

module.exports = {
    addhris: function (req, res, next) {
        const data = {
            guid: uuid.v4(),
            userId: req.user.roleId == 3 ? req.user.id : req.body.userId,
            designation: req.body.designation,
            exBeforeJoin: req.body.exBeforeJoin,
            exAfterJoin: req.body.exAfterJoin,
            referenceContact: req.body.referenceContact,
            slackId: req.body.slackId,
            slackPassword: req.body.slackPassword,
            skillOfInterest: req.body.skillOfInterest,
            increment: req.body.increment,
            temporaryAddress: req.body.temporaryAddress,
            reasonOfWork: req.body.reasonOfWork,
            served: req.body.served,
            comments: req.body.comments,
            remarks: req.body.remarks,
            exitFormalities: req.body.exitFormalities,
            gmailId: req.body.gmailId,
            gmailPassword: req.body.gmailPassword,
            gmailNewPassword: req.body.gmailNewPassword,
            slackNewPassword: req.body.slackNewPassword,
            incrementDate: req.body.incrementDate,
            isActive: 1
        };
        hrismodel
            .addhris(data)
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

    gethris: function (req, res, next) {
        hrismodel
            .gethris({
                id: req.params.id,
                from: req.query.from ? req.query.from.toLowerCase() : "",
                to: req.query.to ? req.query.to.toLowerCase() : "",
                timePeriod: req.query.timePeriod
                    ? req.query.timePeriod.toLowerCase()
                    : "",
                userId: req.query.userId ? req.query.userId.toLowerCase() : "",
                month: req.query.month ? req.query.month.toLowerCase() : "",
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

    edithris: function (req, res, next) {
        hrismodel
            .edithris({
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
