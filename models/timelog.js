var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");

module.exports = {
  addtimelog: async function (data) {
    const result = await this.todaytimelog(data);
    var query = "INSERT INTO tbltimelog(checkInDate,checkInTime,userId,delayedTime,checkOutTime,task,pauseTime,workingHour, createdOn) VALUES(:checkInDate,:checkInTime,:userId,:delayedTime ,:checkOutTime,:task,:pauseTime,:workingHour,now())";
    return utility.query(query, data);
  },

  gettimelog: function (data) {
    var whereClause = "";
    if (data && data.id) {
      whereClause += " t.id = :id";
    }
    if (data && data.userId) {
      whereClause += " t.userId = :userId";
    }
    if (data && data.timePeriod) {
      if (whereClause.length) whereClause += " and ";
      if (data.timePeriod == "today") {
        whereClause += " DATE(t.createdOn) = CURDATE()";
      } else if (data.timePeriod == "weekly") {
        whereClause += " t.createdOn >= DATE(NOW()) - INTERVAL 7 DAY";
      } else if (data.timePeriod == "monthly") {
        whereClause += " MONTH(t.createdOn) = MONTH(CURDATE())";
      } else if (data.timePeriod == "last3months") {
        whereClause += " t.createdOn >= DATE(NOW()) - INTERVAL 3 MONTH"
      } else if (data.timePeriod == "last6months") {
        whereClause += " t.createdOn >= DATE(NOW()) - INTERVAL 6 MONTH"
      } else if (data.timeperiod == "1year") {
        whereClause += "t.createdOn >= DATE(NOW()) - INTERVAL 12 MONTH "
      }
    }
    if (data && data.from && data.to) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " t.createdOn BETWEEN :from AND :to "
    }
    if (whereClause.length) {
      whereClause = " WHERE" + whereClause;
    }
    var query =
      "SELECT t.*,CONCAT(u.firstName, ' ', u.lastName) as fullName FROM tbltimelog t";
    query += ` INNER JOIN tblusers u ON u.id = t.userId ${whereClause}`;
    return utility.query(query, data);
  },
  todaytimelog: function (data) {
    var query = "SELECT * FROM tbltimelog where checkInDate = Date(now())";
    if (data) {
      query += " and userId = :userId";
    }
    return utility.query(query, data);
  },
  checkouttime: function (data) {
    var query = "SELECT * FROM tbltimelog where checkOutDate = Date(now())";
    if (data) {
      query += " and userId = :userId";
    }
    return utility.query(query, data);
  },
  editlog: function (data) {

    var query = "UPDATE tbltimelog SET";
    if (data && data.checkOutDate) {
      query += " checkOutDate = :checkOutDate,";
    }
    if (data && data.checkOutTime) {
      query += " checkOutTime = :checkOutTime,";
    }
    if (data && data.pauseTime) {
      query += " pauseTime = :pauseTime";
    }
    if (data && data.workingHour) {
      query += " workingHour = :workingHour";
    }
    query += " WHERE id=:id";

    return utility.query(query, data);
  },
  alltimelog: function (data) {
    var query =
      " SELECT userId,checkInDate,delayedTime FROM tbltimelog WHERE checkInDate BETWEEN (NOW() - INTERVAL 7 DAY) AND NOW()";
    if (data) {
      query += " and userId = :userId";
    }
    return utility.query(query, data);
  },
  monthlytimelog: function (data) {
    var query =
      "SELECT * FROM tbltimelog WHERE MONTH(checkInDate) = MONTH(CURDATE())";
    if (data) {
      query += " and userId = :userId";
    }
    return utility.query(query, data);
  },
  pauseTimelog: function (data) {
    var query = "UPDATE tbltimelog SET";
    if (data && data.pauseTime) {
      query += " pauseTime = :pauseTime";
    }
    query += " WHERE userId=:userId";

    return utility.query(query, data);
  },
  pauseOutlog: function (data) {
    var query = "UPDATE tbltimelog SET";
    if (data && data.pauseOutTime) {
      query += " pauseOutTime = :pauseOutTime";
    }
    query += " WHERE userId=:userId";

    return utility.query(query, data);
  },
  getpauseInTime: function (data) {
    var query =
      "SELECT t.pauseTime FROM tbltimelog t WHERE t.checkInDate=Date(now()) AND t.userId= :userId";
    return utility.query(query, data);
  },
};
