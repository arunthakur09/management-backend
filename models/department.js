var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");

module.exports = {
  addDepartment: function (data) {
    var query =
      "INSERT INTO tbldepartments(guid, departmentName, shortCode,kra, isActive, createdOn) VALUES(:guid, :departmentName, :shortCode,:kra, :isActive, now())";
    return utility.query(query, data);
  },
  // getDepartment: function(data) {
  //   var query =
  //     "SELECT id as deptId,departmentName,shortCode,guid,isActive, createdOn FROM tbldepartments";
  //   if (data && data.id) {
  //     query += " WHERE id = :id";
  //   }
  //   return utility.query(query, data);
  // },
  getDepartments: function (data) {
    var query =
      "SELECT id, departmentName, shortCode, kra,(Case When isActive=1 Then 1 Else 0 End) AS isActive FROM tbldepartments";
    if (data && data.id) {
      query += " WHERE id = :id";
    }
    return utility.query(query, data);
  },

  editDepartment: function (data) {
    var query = "UPDATE tbldepartments SET";
    if (data && data.departmentName) {
      query += " departmentName = :departmentName,";
    }

    if (data && data.shortCode) {
      query += " shortCode = :shortCode,";
    }
    if (data && data.kra) {
      query += " kra = :kra,";
    }
    if (data && "isActive" in data) {
      query += " isActive = :isActive";
    }

    if (data && data.id) {
      query += " WHERE id=:id";
    }
    return utility.query(query, data);
  },

  deleteDepartment: function (data) {
    var query = "UPDATE tbldepartments SET isActive = 0 WHERE id = :id";
    return utility.query(query, data);
  }
};
