var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");

module.exports = {
  addperformance: function(data) {
    var query =
      "INSERT INTO tblperformancematrixsubcategory(name,guid,parentId,isActive,createdOn) VALUES(:name,:guid,:parentId,:isActive,now())";
    return utility.query(query, data);
  },
  getsubperformances: function(data) {
    var query = "SELECT * FROM tblperformancematrixsubcategory ";
    if (data && data.id) {
      query += " WHERE id = :id";
    }
    return utility.query(query, data);
  },
  getsubperformance: function(data) {
    var query =
      "SELECT u.*,up.name,up.percentage FROM tblperformancematrixsubcategory u";
    query +=
      " INNER JOIN tblperformancematrixparameters up ON up.id = u.parentId  ";
    if (data && data.id) {
      query += " WHERE u.id = :id";
    }
    return utility.query(query, data);
  },

  deletesubperformance: function(data) {
    var query =
      "UPDATE tblperformancematrixsubcategory SET isActive=0 WHERE id=:id";

    return utility.query(query, data);
  },
  editsubPerformance: function(data) {
    var query = "UPDATE tblperformancematrixsubcategory SET";
    if (data && data.name) {
      query += " name = :name";
    }
    if (data && data.shortCode) {
      query += " ,shortCode = :shortCode";
    }
    if (data && data.parentId) {
      query += " ,parentId = :parentId";
    }
    if (data && "isActive" in data) {
      query += " ,isActive = :isActive";
    }
    query += " WHERE id=:id";
    return utility.query(query, data);
  }
};
