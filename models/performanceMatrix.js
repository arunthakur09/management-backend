var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");

module.exports = {
  addperformance: function(data) {
    var query =
      "INSERT INTO tblperformancematrixparameters(name,guid,percentage,isActive,createdOn) VALUES(:name,:guid,:percentage,:isActive,now())";
    return utility.query(query, data);
  },
  getperformances: function(data) {
    var query =
      "SELECT id,name,percentage,(Case When isActive=1 Then 1 Else 0 End) AS isActive FROM tblperformancematrixparameters";
    if (data && data.id) {
      query += " WHERE id = :id";
    }
    return utility.query(query, data);
  },
  // getperformance: function(data) {
  //   var query =
  //     "SELECT id,name,percentage, createdOn,(Case When isActive=1 Then 1 Else 0 End) AS isActive FROM tblperformancematrixparameters ";
  //   if (data && data.id) {
  //     query += " WHERE id = :id";
  //   }
  //   return utility.query(query, data);
  // },
  deleteperformance: function(data) {
    var query =
      "UPDATE tblperformancematrixparameters SET isActive=0 WHERE id=:id";

    return utility.query(query, data);
  },
  editPerformance: function(data) {
    var query = "UPDATE tblperformancematrixparameters SET";
    if (data && data.name) {
      query += " name = :name,";
    }

    if (data && data.percentage) {
      query += " percentage = :percentage,";
    }
    if (data && "isActive" in data) {
      query += " isActive = :isActive";
    }

    if (data && data.percentage) {
      query += " WHERE id=:id";
    }

    return utility.query(query, data);
  }
};
