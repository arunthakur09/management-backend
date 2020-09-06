var candidacyModule = require("../models/hrcandidacy.js");
var logger = require("../models/logger.js");
var _ = require("underscore");
var usersModel = require("../models/users.js");
var Q = require("q");
var uuid = require("uuid");
const fs = require('fs');
//const pdfs = require("pdfjs");
const csv = require("fast-csv");
module.exports = {
  addCandidacyFields: function (req, res, next) {
    // if (
    //   !req.body.candidateName ||
    //   !req.body.email ||
    //   !req.body.dob ||
    //   !req.body.skills ||
    //   !req.body.status ||
    //   !req.body.experience ||
    //   !req.body.department ||
    //   !req.body.rounds ||
    //   !req.body.currentSalary ||
    //   !req.body.expectedSalary ||
    //   !req.body.noticePeriod ||
    //   !req.body.interviewDate ||
    //   !req.body.interviewTime ||
    //   !req.body.interviewMode ||
    //   !req.body.reasonForChange ||
    //   !req.body.outcome
    // ) {
    //   res.statusCode = config.badRequest;
    //   return res.json({ result: appResource.badRequest });
    // }
    if (req.file) {
      var file = fs.readFileSync(req.file.path)
      var encode_image = file.toString('base64');
      var finalImg = {
        contentType: req.file.mimetype,
        resume: file
        //id: id
      };
    }
    const data = {
      guid: uuid.v4(),
      candidateName: req.body.candidateName,
      email: req.body.email,
      //dob: req.body.dob,
      skills: req.body.skills,
      //status: req.body.status,
      experience: req.body.experience,
      departmentId: req.body.departmentId,
      rounds: req.body.rounds,
      currentSalary: req.body.currentSalary,
      expectedSalary: req.body.expectedSalary,
      noticePeriod: req.body.noticePeriod,
      interviewDate: req.body.interviewDate,
      interviewTime: req.body.interviewTime,
      interviewMode: req.body.interviewMode,
      reasonForChange: req.body.reasonForChange,
      hiringManager: req.body.hiringManager,
      phone: req.body.phone,
      status: req.body.status,
      source: req.body.source,
      qualification: req.body.qualification,
      //resume: '',
      userId: req.user.id,
      resume: encode_image ? encode_image : "",
      isActive: 1,
      outcome: 'pending'
    };

    candidacyModule
      .addCandidacyFields(data)
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
  getCandidacyFields: function (req, res, next) {
    candidacyModule
      .getCandidacyFields({
        id: req.params.id,
        timePeriod: req.query.timePeriod ? req.query.timePeriod : "",
        edit: req.query.edit,
        limit: req.query.limit && req.query.limit > 0 ? req.query.limit : 10,
        //offset: req.query.offset ? req.query.offset : 0,
        offset:
          req.query.page && req.query.page > 0
            ? (parseInt(req.query.page) - 1) *
            (req.query.limit ? req.query.limit : 10)
            : 0,
        outcome: req.query.outcome ? req.query.outcome : "",
        userId: req.user.roleId == 3 && req.user.id !== 3 ? req.user.id : (req.query.userId ? parseInt(req.query.userId) : ""),
        skills: req.query.skills ? req.query.skills : "",
        source: req.query.source ? req.query.source : "",
        candidateName: req.query.candidateName ? req.query.candidateName : "",
        from: req.query.from ? req.query.from : "",
        to: req.query.to ? req.query.to : "",
        month: req.query.month ? req.query.month : "",
        isActive: req.query.isActive ? req.query.isActive : ""
      })
      .then(
        function (result) {
          if (req.query.edit == "true") {
            const candidateName = result[0].candidateName.split(' ');
            const userdata = {
              guid: result[0].guid,
              firstName: candidateName[0],
              lastName: candidateName[1],
              //dob: result[0].dob,
              skills: result[0].skills,
              email: result[0].email,
              hiringManager: result[0].hiringManager,
              isActive: result[0].isActive,
              gender: "",
              userKra: "",
              password: "",
              maritalStatus: "",
              nationality: "",
              streetAddress: "",
              city: "",
              state: "",
              postalCode: "",
              country: "",
              phoneP: "",
              phoneW: "",
              emailP: "",
              jobTitle: "",
              joiningDate: new Date(),
              employeeStatus: "",
              supervisor: "",
              subordinate: "",
              workExperience: "",
              education: "",
              dob: "",
            }
            console.log(userdata)
            // usersModel.insertRoles({
            //   roleId: 3,

            // })
            usersModel.registerUser(userdata).then(
              function (result) {
                console.log(result);
              },
              function (err) {
                console.log(err);
              }
            );
            usersModel.addUserDepartment({
              userId: result[0].id,
              departmentId: result[0].departmentId
            }).then(
              function (result) {
                console.log(result);
              },
              function (err) {
                console.log(err);
              }
            );
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
  editCandidacyFields: function (req, res, next) {
    // if (
    //   !req.params.id ||
    //   !req.body.candidateName ||
    //   !req.body.experience ||
    //   !req.body.currentSalary ||
    //   !req.body.expectedSalary ||
    //   !req.body.noticePeriod ||
    //   !req.body.interviewDate ||
    //   !req.body.interviewTime ||
    //   !req.body.interviewMode ||
    //   !req.body.reasonForChange ||
    //   !req.body.outcome
    // ) {
    //   res.statusCode = config.badRequest;
    //   return res.json({ result: appResource.badRequest });
    // }
    candidacyModule
      .editCandidacyFields({
        ...req.body,
        outcome: req.body.outcome,
        id: parseInt(req.params.id)
      })
      .then(
        function (result) {
          if (req.body.outcome == "selected") {
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
  deleteCandidacyFields: function (req, res, next) {
    if (!req.params.id) {
      res.statusCode = config.badRequest;
      return res.json({ result: appResource.badRequest });
    }
    candidacyModule
      .deleteCandidacyFields({ id: req.params.id })
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
  uploadresume: function (req, res, next) {
    var id = req.params.id;
    var file = fs.readFileSync(req.file.path)

    var encode_image = file.toString('base64');
    //console.log("encode_img", encode_image)
    var finalImg = {
      contentType: req.file.mimetype,
      resume: encode_image,
      id: id
    };
    candidacyModule
      .editCandidacyFields(finalImg)
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
          data.candidateName = data.candidateName ? data.candidateName : '',
          data.email = data.email ? data.email : '',
          data.qualification = data.qualification ? data.qualification : '',
          data.skills = data.skills ? data.skills : '',
          data.experience = data.experience ? data.experience : '',
          data.rounds = data.rounds ? data.rounds : '',
          data.status = data.status ? data.status : '',
          data.reasonForChange = data.reasonForChange ? data.reasonForChange : '',
          data.currentSalary = data.currentSalary ? data.currentSalary : '',
          data.expectedSalary = data.expectedSalary ? data.expectedSalary : '',
          data.noticePeriod = data.noticePeriod ? data.noticePeriod : '',
          data.interviewDate = data.interviewDate ? data.interviewDate : '',
          data.interviewTime = data.interviewTime ? data.interviewTime : '',
          data.interviewMode = data.interviewMode ? data.interviewMode : '',
          data.reasonForChange = data.reasonForChange ? data.reasonForChange : '',
          data.outcome = data.outcome ? data.outcome : '',
          data.hiringManager = data.hiringManager ? data.hiringManager : '',
          data.userId = data.userId ? data.userId : '',
          data.phone = data.phone ? data.phone : '',
          data.resume = data.resume ? data.resume : '',
          data.isActive = 1
        data.source = data.source ? data.source : ''
        candidacyModule
          .addCandidacyFields(data)
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
};
