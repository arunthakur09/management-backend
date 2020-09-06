var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");

module.exports = {
  // addcrmFields: function(data) {
  //   var query =
  //     "INSERT INTO tblCRM(userId,clientName,profile,date,portal,source,isActive, createdOn) VALUES(:userId, :clientName, :profile,:date,:portal,:source, :isActive, now())";
  //   return utility.query(query, data);
  // },
  getcrmFields: function(data) {
    var query =
      "SELECT userId,clientName, profile,date,portal,email,company,(Case When isActive=1 Then 1 Else 0 End) AS isActive FROM tblproposalsubmission";
    if (data && data.id) {
      query += " WHERE id = :id";
    }
    return utility.query(query, data);
  },
  editcrmFields: function(data) {
    var query = "UPDATE tblproposalsubmission SET";
    if (data && data.userId) {
      query += " userId = :userId,";
    }

    if (data && data.clientName) {
      query += " clientName = :clientName,";
    }
    if (data && data.profile) {
      query += " profile = :profile,";
    }
    if (data && data.portal) {
      query += " portal = :portal,";
    }
    if (data && data.email) {
      query += "company = :email,";
    }
    if (data && data.company) {
      query += " company = :company,";
    }
    if (data && data.date) {
      query += " date = :date,";
    }
    if (data && "isActive" in data) {
      query += " isActive = :isActive";
    }
    if (data && data.id) {
      query += " WHERE id=:id";
    }
    return utility.query(query, data);
  },
  deletecrmFields: function(data) {
    var query = "UPDATE tblproposalsubmission SET isActive = 0 WHERE id = :id";
    return utility.query(query, data);
  }
};
