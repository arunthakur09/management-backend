var holidayModule = require("../models/holiday");
var logger = require("../models/logger.js");
var uuid = require("uuid");
module.exports = {
    addHoliday: function (req, res, next) {
        const data = {
            guid: uuid.v4(),
            name: req.body.name,
            day: req.body.day ? req.body.day : '',
            fromDate: req.body.fromDate,
            toDate: req.body.toDate,
            isActive: 1
        };
        holidayModule
            .addHoliday(data)
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
    getHoliday: function (req, res, next) {
        holidayModule
            .getHoliday({
                id: req.params.id,
                monthly: req.query.monthly ? req.query.monthly : ''
            })
            .then(
                (result) => {
                    return res.json({ result: appResource.success, data: result });
                }
            )
            .catch(
                (err) => {
                    res.statusCode = config.serverError;
                    return res.json({
                        result: appResource.serverError,
                        statusText: "error"
                    });
                }
            )
    },
    editHoliday: function (req, res, next) {
        holidayModule
            .editHoliday({
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
    deleteHoliday: function (req, res, next) {
        if (!req.params.id) {
            res.statusCode = config.badRequest;
            return res.json({ result: appResource.badRequest });
        }
        holidayModule
            .deleteHoliday({ id: req.params.id })
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
}