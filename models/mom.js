var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");

module.exports = {
  addmomfields: function (data) {
    var query =
      "INSERT INTO tblmomfields(userId,guid,email,reasonOfMeeting,dateOfMom,durationMeeting,initiated,participants,clientName,medium,communication,clientInput,development,core,designing,hr,approved,status,createdOn) VALUES(:userId,:guid,:email,:reasonOfMeeting,:dateOfMom,:durationMeeting,:initiated,:participants,:clientName,:medium,:communication,:clientInput,:development,:core,:designing,:hr,:approved,:status,now())";
    return utility.query(query, data);
  },
  getmomfields: function (data) {
    var query = "SELECT * FROM tblmomfields";
    if (data.roleId == 3 && data.userId) {
      query += " WHERE userId = :userId"
      if (data.id) {
        query += " AND guid = :id"
      }
    } else {
      if (data.id) {
        query += " WHERE guid = :id"
      }
    }
    return utility.query(query, data);
  },
  editmomfields: function (data) {
    var query = "UPDATE tblmomfields SET";
    if (data && data.email) {
      query += " email = :email,";
    }
    if (data && data.reasonOfMeeting) {
      query += " reasonOfMeeting = :reasonOfMeeting,";
    }
    if (data && data.dateOfMom) {
      query += " dateOfMom = :dateOfMom,";
    }
    if (data && data.durationMeeting) {
      query += " durationMeeting = :durationMeeting,";
    }
    if (data && data.initiated) {
      query += " initiated = :initiated,";
    }
    if (data && data.participants) {
      query += " participants = :participants,";
    }
    if (data && data.clientName) {
      query += " clientName = :clientName,";
    }
    if (data && data.medium) {
      query += " medium = :medium,";
    }
    if (data && data.communication) {
      query += " communication = :communication,";
    }
    if (data && data.clientInput) {
      query += " clientName = :clientName,";
    }
    if (data && data.development) {
      query += " development = :development,";
    }
    if (data && data.core) {
      query += " core = :core,";
    }
    if (data && data.designing) {
      query += " designing = :designing,";
    }
    if (data && data.hr) {
      query += " hr = :hr,";
    }
    if (data && data.approved) {
      query += " approved = :approved,";
    }

    if (data && data.status) {
      query += " status = :status";
    }

    if (data && data.id) {
      query += " WHERE guid=:id";
    }
    return utility.query(query, data);
  },
  deletemomfields: function (data) {
    var query = "UPDATE tblmomfields SET isActive = 0 WHERE guid = :id";
    return utility.query(query, data);
  },

};
