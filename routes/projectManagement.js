var projectManagementModel = require("../models/projectManagement");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");
var uuid = require("uuid");

module.exports = {
    addProjectDetails: function (req, res, next) {
        const data = {
            guid: uuid.v4(),
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            customerDeadline: req.body.customerDeadline,
            clientName: req.body.clientName,
            taskPresets: req.body.taskPresets,
            commentFallback: req.body.commentFallback,
            person: req.body.person ? req.body.person : "",
            projectRole: req.body.projectRole,
            comment: req.body.comment,
            dealsId: req.body.dealsId,
            isActive: 1
        };

        projectManagementModel
            .addProjectDetails(data)
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

    getProjectDetails: function (req, res, next) {
        projectManagementModel
            .getProjectDetails({
                id: req.params.id
            })
            .then(
                function (result) {
                    console.log("Result>>>>", result)
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

    editProjectDetails: function (req, res, next) {
        projectManagementModel
            .editProjectDetails({
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
    // deleteDepartment: function (req, res, next) {
    //     if (!req.params.id) {
    //         res.statusCode = config.badRequest;
    //         return res.json({ result: appResource.badRequest });
    //     }
    //     departmentModel
    //         .deleteDepartment({ id: req.params.id })
    //         .then(
    //             function (result) {
    //                 return res.json({ result: appResource.success, data: result });
    //             },
    //             function (err) {
    //                 res.statusCode = config.serverError;
    //                 return res.json({
    //                     result: appResource.serverError,
    //                     statusText: "error"
    //                 });
    //             }
    //         )
    //         .fail(logger.handleError);
    // }
};
