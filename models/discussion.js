var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");

module.exports = {
  addDiscussionFields: function (data) {
    if (data.status == "approved") {
      var query =
        "INSERT INTO tbldiscussion(salesUserId, proposalId, status,projectType,createdOn) VALUES(:salesUserId,:id,:status,:projectType,now())";
      return utility.query(query, data);
    }
  },
  getDiscussionFields: function (data) {
    var query = "SELECT d.salesUserId,d.proposalId,d.status,t.employeeTarget FROM tbldiscussion d";
    query += " INNER JOIN tblproposalsubmission p ON p.id = d.proposalId ";
    query += " INNER JOIN tblsalesTarget t ON t.userId = p.userId"
    if (data && data.proposalId) {
      query += " WHERE d.proposalId = :proposalId";
    }
    return utility.query(query, data);
  },
  deleteDiscussionields: function (data) {
    var query =
      "UPDATE tbldiscussion SET isActive = 0 WHERE proposalId = :proposalId";
    return utility.query(query, data);
  }
};




