var submissionModel = require("../models/proposalsubmission.js");
var discussionModel = require("../models/discussion.js");
var projectManagementModel = require("../models/projectManagement");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");
const path = require("path");
const uuid = require("uuid");
const csv = require("fast-csv");
const upload = require("express-fileupload");
const fs = require('fs');
const csvParser = require('csv-parser');
const multer = require('multer');

module.exports = {
  addProposalFields: function (req, res, next) {
    // if (
    //   !req.body.userId

    // ) {
    //   res.statusCode = config.badRequest;
    //   return res.json({ result: appResource.badRequest });
    // }
    const data = {
      userId: req.user.roleId == 3 ? req.user.id : req.body.userId,
      guid: uuid.v4(),
      profile: req.body.profile,
      date: req.body.date,
      portal: req.body.portal,
      clientName: req.body.clientName,
      countryCityState: req.body.countryCityState,
      company: req.body.company,
      email: req.body.email,
      emailP: req.body.emailP,
      phone: req.body.phone,
      phoneP: req.body.phoneP,
      domain: req.body.domain,
      submissionTitle: req.body.submissionTitle,
      pitchContent: req.body.pitchContent,
      jobReqLink: req.body.jobReqLink,
      proposalLink: req.body.proposalLink,
      clientPostedDateTime: req.body.clientPostedDateTime,
      projectType: req.body.projectType,
      proposalSubmissionDateTime: req.body.proposalSubmissionDateTime,
      jobRequirement: req.body.jobRequirement,
      hourlyRate: req.body.hourlyRate,
      upworkId: req.body.upworkId,
      linkedInProfile: req.body.linkedInProfile,
      budget: req.body.budget,
      companyEmail: req.body.companyEmail,
      patternEmail: req.body.patternEmail,
      clientDesignation: req.body.clientDesignation,
      leadStatus: req.body.leadStatus,
      companyUrl: req.body.companyUrl,
      companyPhone: req.body.companyPhone,
      companylinkedInProfile: req.body.companylinkedInProfile,
      proposalTime: req.body.proposalTime ? req.body.proposalTime : "",
      followUpDate: "",
      followUpTime: "",
      comment: "",
      status: 'pending',
      rating: 0,
      isActive: 1
    };
    submissionModel
      .addProposalFields(data)
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
  getProposalFields: async function (req, res, next) {
    const AverageRating = await submissionModel.getProposal({
      userId: req.user.roleId == 3 && req.user.id !== 7 ? req.user.id : (req.query.userId ? parseInt(req.query.userId) : ""),
    })
    const statusCount = await submissionModel.getTotalField({
      userId: req.user.roleId == 3 && req.user.id !== 7 ? req.user.id : (req.query.userId ? parseInt(req.query.userId) : ""),
    })
    var Rating = {
      average: AverageRating[0].Avg
    }
    const proposalCount = await submissionModel.getproposalCount({
      userId: req.user.roleId == 3 && req.user.id !== 7 ? req.user.id : (req.query.userId ? parseInt(req.query.userId) : ""),
      portal: req.query.portal ? req.query.portal.toLowerCase() : "",
      from: req.query.from ? req.query.from.toLowerCase() : "",
      to: req.query.to ? req.query.to.toLowerCase() : "",
      timePeriod: req.query.timePeriod
        ? req.query.timePeriod.toLowerCase()
        : "",
      status: req.query.status ? req.query.status.toLowerCase() : "",
      clientName: req.query.clientName ? req.query.clientName.toLowerCase() : "",
      domain: req.query.domain ? req.query.domain.toLowerCase() : "",
    })
    submissionModel
      .getProposalUserFields({
        userId: req.user.roleId == 3 && req.user.id !== 7 ? req.user.id : (req.query.userId ? parseInt(req.query.userId) : ""),
        limit: req.query.limit && req.query.limit > 0 ? req.query.limit : 10,
        offset: req.query.offset ? req.query.offset : 0,
        offset:
          req.query.page && req.query.page > 0
            ? (parseInt(req.query.page) - 1) *
            (req.query.limit ? req.query.limit : 10)
            : 0,
        portal: req.query.portal ? req.query.portal.toLowerCase() : "",
        from: req.query.from ? req.query.from.toLowerCase() : "",
        to: req.query.to ? req.query.to.toLowerCase() : "",
        timePeriod: req.query.timePeriod
          ? req.query.timePeriod.toLowerCase()
          : "",
        month: req.query.month ? req.query.month : "",
        status: req.query.status ? req.query.status.toLowerCase() : "",
        clientName: req.query.clientName ? req.query.clientName.toLowerCase() : "",
        domain: req.query.domain ? req.query.domain.toLowerCase() : "",
      })
      .then(
        async function (result) {
          const getportalCount = await submissionModel.getportalCount({
            userId: req.user.roleId == 3 && req.user.id !== 7 ? req.user.id : (req.query.userId ? parseInt(req.query.userId) : ""),
            portal: req.query.portal ? parseInt(req.query.portal) : "",
          })
          var id = getportalCount[0].id
          if (getportalCount[0].portal !== "") {
            var count = getportalCount && getportalCount.map(el => {
              const data = {
                count: el.c,
                portal: el.portal
              }
              return (
                data)
            });
          }
          var tableRecords = {
            count: count,
            filteredRecords: result.length,
            totalRecords: 0,
            statusCount: statusCount
          };
          if (tableRecords.filteredRecords) {
            tableRecords.totalRecords = result[0].totalRecords;
          }
          return res.json({
            result: appResource.success,
            tableRecords,
            id,
            Rating,
            data: result,
            proposalCount: proposalCount,
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
  getProposalField: async function (req, res, next) {
    submissionModel
      .getProposalFields({
        id: req.params.id,
        status: req.query.status ? req.query.status : "",
        edit: req.query.edit ? req.query.edit : ""
      })
      .then(
        function (result) {
          if (req.query.edit == 'true') {
            console.log(result)
            const data = {
              guid: uuid.v4(),
              title: result[0].submissionTitle,
              dealsId: result[0].id,
              description: '',
              status: '',
              startDate: '',
              endDate: '',
              customerDeadline: '',
              clientName: result[0].clientName,
              taskPresets: '',
              commentFallback: '',
              person: '',
              projectRole: '',
              comment: '',
              isActive: 1
            }
            console.log('data', data)
            projectManagementModel
              .addProjectDetails(data)
              .then(
                function (result) {
                  console.log(result);
                },
                function (err) {
                  console.log(err);
                }
              )
          }
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
  editProposalFields: async function (req, res, next) {
    // if (
    //   !req.body.profile ||
    //   !req.body.date ||
    //   !req.body.portal ||
    //   !req.body.clientName ||
    //   !req.body.countryCityState ||
    //   !req.body.company ||
    //   !req.body.email ||
    //   !req.body.phone ||
    //   !req.body.domain ||
    //   !req.body.submissionTitle ||
    //   !req.body.pitchContent ||
    //   !req.body.jobReqLink ||
    //   !req.body.proposalLink ||
    //   !req.body.clientPostedDateTime ||
    //   !req.body.projectType ||
    //   !req.body.TargetAchieved ||
    //   !req.body.proposalSubmissionDateTime ||
    //   !req.body.status
    // ) {
    //   res.statusCode = config.badRequest;
    //   return res.json({ result: appResource.badRequest });
    // }
    const data = await discussionModel.getDiscussionFields({
      proposalId: req.params.id
    });
    submissionModel
      .editProposalFields({
        ...req.body,
        isActive: req.body.isActive,
        rating: req.body.rating,
        id: parseInt(req.params.id)
      })
      .then(
        function (result) {
          if (data.length < 1 && req.body.status == "approved") {
            discussionModel.addDiscussionFields({
              ...req.body,
              id: parseInt(req.params.id),
              salesUserId: req.user.id,
              isActive: 1
            });
            return res.json({ result: appResource.success, data: result });
          }
          else if (req.body.status == "pending" || req.body.status == "discussion" || req.body.status == "reject") {
            discussionModel.deleteDiscussionields({
              ...req.body,
              proposalId: parseInt(req.params.id),
              isActive: 1
            });
          }
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

  deleteProposalFields: function (req, res, next) {
    if (!req.params.id) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    submissionModel
      .deleteProposalFields({ id: req.params.id })
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
  csvfileupload: function (req, res, next) {
    var userId = req.user.id;
    const fileRows = [];
    fs.createReadStream(req.file.path)
      .pipe(csv.parse({ headers: true }))
      .on('data', row => {
        let data = row;
        data.userId = userId;
        data.guid = uuid.v4(),
          data.profile = data.profile ? data.profile : "",
          data.date = data.date ? data.date : "",
          data.portal = data.portal ? data.portal : "LinkedIn",
          data.status = data.status ? data.status : "",
          data.clientName = data.clientName ? data.clientName : "",
          data.countryCityState = data.countryCityState ? data.countryCityState : "",
          data.company = data.company ? data.company : "",
          data.email = data.email ? data.email : "",
          data.phone = data.phone ? data.phone : "",
          data.domain = data.domain ? data.domain : "",
          data.submissionTitle = data.submissionTitle ? data.submissionTitle : "",
          data.pitchContent = data.pitchContent ? data.pitchContent : "",
          data.jobReqLink = data.jobReqLink ? data.jobReqLink : "",
          data.proposalLink = data.proposalLink ? data.proposalLink : "",
          data.clientPostedDateTime = data.clientPostedDateTime ? data.clientPostedDateTime : "",
          data.projectType = data.projectType ? data.projectType : "",
          data.proposalSubmissionDateTime = data.proposalSubmissionDateTime ? data.proposalSubmissionDateTime : "",
          data.jobRequirement = data.jobRequirement ? data.jobRequirement : "",
          data.hourlyRate = data.hourlyRate ? data.hourlyRate : "",
          data.upworkId = data.upworkId ? data.upworkId : "",
          data.emailP = data.emailP ? data.emailP : "",
          data.phoneP = data.phoneP ? data.phoneP : "",
          data.proposalTime = data.proposalTime ? data.proposalTime : "",
          data.linkedInProfile = data.linkedInProfile ? data.linkedInProfile : "",
          data.budget = data.budget ? data.budget : "",
          data.rating = data.rating ? data.rating : 0,
          data.companyEmail = data.companyEmail ? data.companyEmail : "",
          data.companyUrl = data.companyUrl ? data.companyUrl : "",
          data.patternEmail = data.patternEmail ? data.patternEmail : "",
          data.clientDesignation = data.clientDesignation ? data.clientDesignation : "",
          data.leadStatus = data.leadStatus ? data.leadStatus : "",
          data.followUpDate = data.followUpDate ? data.followUpDate : "",
          data.followUpTime = data.followUpTime ? data.followUpTime : "",
          data.isActive = 1
        submissionModel
          .addProposalFields(data)
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
          .fail(logger.handleError)
      })
  },
  addrexproposal: function (req, res, next) {
    const data = {
      guid: uuid.v4(),
      clientName: req.body.clientName,
      email: req.body.email,
      phone: req.body.phone,
      jobRequirement: req.body.jobRequirement,//message
      callSource: req.body.callsource,//skypewhtsapp
      isActive: 1
    };
    submissionModel
      .addrexproposal(data)
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
};
