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
const fs = require('fs');

module.exports = {
  addUser: function (req, res) {
    // if (
    //   !req.body.email ||
    //   !req.body.password ||
    //   !req.body.firstName ||
    //   !req.body.lastName ||
    //   !req.body.departmentId ||
    //   !req.body.userKra ||
    //   !req.body.skills ||
    //   !req.body.dob ||
    //   !req.body.gender
    // ) {
    //   res.statusCode = config.badRequest;
    //   return res.json({ result: appResource.badRequest });
    // }
    // if (req.body.password.length < 6) {
    //   res.statusCode = config.badRequest;
    //   return res.json({ result: appResource.shortPassword });
    // }
    var data = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      maritalStatus: req.body.maritalStatus,
      nationality: req.body.nationality,
      streetAddress: req.body.streetAddress,
      city: req.body.city,
      state: req.body.state,
      postalCode: req.body.postalCode,
      country: req.body.country,
      phoneP: req.body.phoneP,
      phoneW: req.body.phoneW,
      emailP: req.body.emailP,
      jobTitle: req.body.jobTitle,
      joiningDate: req.body.joiningDate,
      employeeStatus: req.body.employeeStatus,
      supervisor: req.body.supervisor,
      subordinate: req.body.subordinate,
      workExperience: req.body.workExperience,
      education: req.body.education,
      userKra: req.body.userKra,
      gender: req.body.gender,
      password: passwordHash.generate(req.body.password),
      skills: req.body.skills,
      dob: req.body.dob,
      isActive: 1,
      guid: uuid.v4(),
      departmentId: req.body.departmentId,
      gender: req.body.gender,
      userImage: '',
      isDepartmentHead: 0,
      isResigned: ""
    };
    // data.isActive = false;
    usersModel
      .registerUser(data)
      .then(
        function (result) {
          if (result == config.alreadyExist) {
            res.statusCode = config.alreadyExist;
            return res.json({
              result: appResource.userExists,
              statusText: "error"
            });
          } else if (result == config.notAcceptable) {
            res.statusCode = config.notAcceptable;
            return res.json({
              result: appResource.registeredButInactive,
              statusText: "error"
            });
          } else {
            usersModel.addRoles(result.insertId, []).then(
              function (result) {
                console.log(result)
              },
              function (err) {
                console.log(err);
              }
            );
            usersModel
              .addUserDepartment({
                userId: result.insertId,
                departmentId: req.body.departmentId
              })
              .then(
                function (result) {
                  console.log(result);
                },
                function (err) {
                  console.log(err);
                }
              );
            return res.json({
              result: appResource.successRegister,
              statusText: "success",
              data: data.guid
            });
          }
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

  editUser: async function (req, res, next) {
    try {
      const { permissionId } = req.body;
      const hasPermission = await usersModel.editUserPermissions({
        id: parseInt(req.params.id),
        permissionId
      });
      const data = {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        maritalStatus: req.body.maritalStatus,
        nationality: req.body.nationality,
        streetAddress: req.body.streetAddress,
        city: req.body.city,
        state: req.body.state,
        postalCode: req.body.postalCode,
        country: req.body.country,
        phoneP: req.body.phoneP,
        phoneW: req.body.phoneW,
        emailP: req.body.emailP,
        jobTitle: req.body.jobTitle,
        joiningDate: req.body.joiningDate,
        employeeStatus: req.body.employeeStatus,
        supervisor: req.body.supervisor,
        subordinate: req.body.subordinate,
        workExperience: req.body.workExperience,
        education: req.body.education,
        userKra: req.body.userKra,
        gender: req.body.gender,
        // password: passwordHash.generate(req.body.password),
        skills: req.body.skills,
        ResignedDate: "",
        CurrentDate: "",
        dob: req.body.dob,
        isActive: req.body.isActive,
        guid: uuid.v4(),
        departmentId: req.body.departmentId,
        gender: req.body.gender,
        userImage: '',
        id: parseInt(req.params.id),
        isResigned: ""
      };
      const data1 = {
        departmentId: parseInt(req.body.departmentId),
        userId: parseInt(req.params.id)
      };
      if (data.employeeStatus == 'Resigned' && data.isResigned == 0) {

        var todayDate = new Date();
        data.CurrentDate = new Date();
        var ResignedDate = todayDate.setDate(todayDate.getDate() + 45);
        data.ResignedDate = moment(ResignedDate).format("YYYY-MM-DD");
        data.isResigned = 1;
      }
      const modifyUser = await usersModel.editUser(data);
      const modifyDepartment = await usersModel.editUserDepartment(data1);
      return res.json({ result: appResource.success, data: data });
    } catch (err) {
      console.log(err);
      res.statusCode = config.serverError;
      return res.json({
        result: appResource.serverError,
        statusText: "error"
      });
    }
  },
  deleteUser: function (req, res, next) {
    // if (!req.params.id) {
    //   res.statusCode = config.badRequest;
    //   return res.json({ result: appResource.badRequest });
    // }
    usersModel
      .deleteUser({ userId: req.params.id })
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
  getUsers: async function (req, res) {
    const systemcount = await usersModel.getadmin({});
    var fullName = req.query.firstName ? req.query.firstName.split(' ') : ''
    usersModel
      .getUsers({
        id: req.params.id,
        userId: req.query.userId,
        firstName: fullName[0],
        lastName: fullName[1],
        isActive: req.query.isActive ? req.query.isActive : '',
        employeeId: req.query.employeeId ? req.query.employeeId : '',
        supervisor: req.query.supervisor ? req.query.supervisor : '',
        jobTitle: req.query.jobTitle ? req.query.jobTitle : '',
        from: req.query.from ? req.query.from : '',
        to: req.query.to ? req.query.to : '',
        timePeriod: req.query.timePeriod ? req.query.timePeriod : '',
        employeeStatus: req.query.employeeStatus ? req.query.employeeStatus : '',
        departmentName: req.query.departmentName ? req.query.departmentName : "",
        month: req.query.month ? req.query.month : "",
        isDepartmentHead: req.query.isDepartmentHead ? req.query.isDepartmentHead : ""
      })
      .then(
        function (result) {
          return res.json({
            result, systemcount
          });
        },
        function (err) {
          res.statusCode = config.serverError;
          return res.json({
            result: appResource.serverError,
            statusText: "error"
          });
        }
      );
  },
  getSalesUser: async function (req, res) {
    usersModel
      .getSalesUser({
        id: req.params.id,
        departmentName: req.query.departmentName ? req.query.departmentName : ""
      })
      .then(
        function (result) {
          return res.json({
            result
          });
        },
        function (err) {
          res.statusCode = config.serverError;
          return res.json({
            result: appResource.serverError,
            statusText: "error"
          });
        }
      );
  },
  imageupload: function (req, res) {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    var finalImg = {
      contentType: req.file.mimetype,
      userImage: req.file.path.replace('public', ''),
      id: req.params.id
    };
    usersModel
      .editUser(finalImg)
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
};
