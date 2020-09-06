var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");

module.exports = {
  addstatus: function (data) {
    var query =
      "INSERT INTO tblpriorityStatus(userId,clientName,date,task,workhours,createdOn) VALUES(:userId,:clientName,:date,:task,:workhours,now())";
    return utility.query(query, data);
  },
  getstatus: function (data) {
    var query =
      "SELECT s.*,u.firstName,u.lastName,u.dob,u.email,up.departmentId,ud.departmentName FROM tblpriorityStatus s";
    query += " INNER JOIN tblusers u ON u.id = s.userId ";
    query += "LEFT JOIN tbluserdepartment up ON s.userId = up.userId ";
    query += "LEFT JOIN tbldepartments ud ON ud.id = up.departmentId";
    if (data && data.id) {
      query += " WHERE s.userId = :id";
    }
    return utility.query(query, data);
  },
  getmonthlystatus: function (data) {
    var query =
      "SELECT s.*,u.firstName,u.lastName,u.dob,u.email,up.departmentId,ud.departmentName FROM tblpriorityStatus s";
    query += " INNER JOIN tblusers u ON u.id = s.userId ";
    query += "LEFT JOIN tbluserdepartment up ON s.userId = up.userId ";
    query += "LEFT JOIN tbldepartments ud ON ud.id = up.departmentId";
    if (data && data.id) {
      query += " WHERE s.userId = :id && MONTH(s.date) = MONTH(CURDATE())";
    }
    return utility.query(query, data);
  },

  editstatus: function (data) {
    var query = "UPDATE tblpriorityStatus SET";

    if (data && data.clientName) {
      query += " clientName = :clientName,";
    }

    if (data && data.date) {
      query += "date = :date,";
    }
    if (data && data.task) {
      query += "task = :task,";
    }

    if (data && data.workhours) {
      query += "workhours = :workhours,";
    }

    if (data && "isActive" in data) {
      query += " isActive = :isActive";
    }

    if (data && data.id) {
      query += " WHERE id=:id";
    }
    return utility.query(query, data);
  },

  deletestatus: function (data) {
    var query = "UPDATE tblpriorityStatus SET isActive = 0 WHERE id = :id";
    return utility.query(query, data);
  }
};
