var permissionModel = require("../models/permissions.js");
var departmentModel = require("../models/department.js");
var logger = require("../models/logger.js");
var _ = require("underscore");
var Q = require("q");

module.exports = {
  getPermissions: async function (req, res, next) {
    let departmentpermissions = [];
    let userpermissions = [];
    const permisions = await permissionModel.getPermissions();
    var permisionsData = permisions.reduce(function (r, a) {
      r[a.moduleName] = r[a.moduleName] || [];
      r[a.moduleName].push(a);
      return r;
    }, Object.create(null));
    const alldepartment = await departmentModel.getDepartments();
    permissionModel
      .getPermissions()
      .then(
        function (result) {
          return res.json({ result, permisionsData, alldepartment });
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
