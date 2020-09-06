var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");

module.exports = {
  addResponse: function(data) {
    var query =
      "INSERT INTO performancematrixuserresponse(userId, UserResponseId,totalPercentage,createdOn) VALUES(:userId, :UserResponseId,:totalpercentage,now())";
    return utility.query(query, data);
  },
  getmatrixEvaluation: function(data) {
    var query = "SELECT id,name,points FROM ` tblMatrixEvaluationParameters`  ";
    return utility.query(query, data);
  },
  getparameters: function(data) {
    var query = "SELECT * FROM performancematrixuserresponse";
    return utility.query(query, data);
  }
};
