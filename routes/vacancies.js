var VacanciesModel = require("../models/vacancies.js");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");
var uuid = require("uuid");

module.exports = {
    addVacancies: function (req, res, next) {
        const data = {
            guid: uuid.v4(),
            jobTitle: req.body.jobTitle,
            assignedPositions: req.body.assignedPositions,
            hiringManager: req.body.hiringManager,
            positions: req.body.positions,
            targetMet: req.body.targetMet,
            description: req.body.description,
            isActive: 1
        };
        VacanciesModel
            .addVacancies(data)
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

    getVacancies: async function (req, res, next) {
        VacanciesModel
            .getVacancies({
                id: req.params.id,
                hiringManager: req.user.roleId == 3 ? req.user.id : (req.query.hiringManager ? parseInt(req.query.hiringManager) : ""),
                from: req.query.from ? req.query.from : "",
                to: req.query.to ? req.query.to : "",
                jobTitle: req.query.jobTitle ? req.query.jobTitle : '',
                timePeriod: req.query.timePeriod ? req.query.timePeriod : ''
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


    editVacancies: function (req, res, next) {
        VacanciesModel
            .editVacancies({
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
    deleteVacancies: function (req, res, next) {
        if (!req.params.id) {
            res.statusCode = config.badRequest;
            return res.json({ result: appResource.badRequest });
        }
        VacanciesModel
            .deleteVacancies({ id: req.params.id })
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
    getHrtarget: async function (req, res, next) {
        const target = await VacanciesModel.selectedTargetCount();
        VacanciesModel
            .getHrtarget({
                userId: req.query.userId,
                from: req.query.from ? req.query.from : "",
                to: req.query.to ? req.query.to : ""

            })
            .then(
                function (result) {
                    return res.json({
                        result: appResource.success, data: result
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

};
