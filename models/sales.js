var utility = require("../scripts/utility.js");
var _ = require("underscore");

module.exports = {
  getsalesTarget: function (data) {
    if (data.timeperiod == "1year") {
      data.totalMonths = 12;
    } else if (data.timeperiod == "last6months") {
      data.totalMonths = 6;
    } else if (data.timeperiod == "last3months") {
      data.totalMonths = 3;
    } else {
      data.totalMonths = 1;
    }
    var whereClause = "";
    var query = `SELECT MONTH(r.createdOn) as months, r.createdOn, tst.userId,CONCAT(u.firstName, ' ', u.lastName) as fullName,tst.employeeTarget* ${data.totalMonths} as employeeTarget,((tst.employeeTarget * ${data.totalMonths})-sum(actualRevenue)) as pending, sum(r.actualRevenue) as Revenue from tblRevenueReports r `;
    query += " INNER JOIN tblsalesTarget tst on tst.userId = r.resourceId "
    query += " INNER JOIN tblusers u on u.id = tst.userId "
    if (data && data.id) whereClause += " r.resourceId = :id";
    if (whereClause.length) {
      query += `WHERE ${whereClause}`
    }
    if (data && data.timeperiod) {
      // change created on to updatedon if we are using proposal  table, otherwise join with discussion table and use created on
      if (whereClause.length) whereClause += " and ";
      if (data.timeperiod == "today") {
        whereClause += " DATE(r.createdOn) = CURDATE()";
      } else if (data.timeperiod == "weekly") {
        whereClause += " r.createdOn >= DATE(NOW()) - INTERVAL 7 DAY";
      } else if (data.timeperiod == "monthly") {
        whereClause += " MONTH(r.createdOn) = MONTH(CURDATE())";
      } else if (data.timeperiod == "last3months") {
        whereClause += "r.createdOn >= DATE(NOW()) - INTERVAL 3 MONTH"
      } else if (data.timeperiod == "last6months") {
        whereClause += "r.createdOn >= DATE(NOW()) - INTERVAL 6 MONTH"
      } else if (data.timeperiod == "1year") {
        whereClause += "r.createdOn >= DATE(NOW()) - INTERVAL 12 MONTH "
      }
    }
    query += " Group by u.id";
    // var query = `SELECT sum(TargetAchieved) as targetAch,CONCAT(u.firstName, ' ', u.lastName) as fullName, tst.employeeTarget * ${data.totalMonths} as target, tst.userId,((tst.employeeTarget * ${data.totalMonths})-sum(TargetAchieved)) as pending from tbldiscussion s `;
    // query += " INNER JOIN tblproposalsubmission sp  on proposalId = sp.id ";
    // query += " INNER JOIN tblsalesTarget tst on tst.userId = sp.userId "
    // query += " INNER JOIN tblusers u on u.id = tst.userId "
    // //query += " INNER JOIN tblRevenueReports r on r.resourceId = u.id "
    // var whereClause = "sp.status='approved'";
    // if (data && data.id) whereClause += " and sp.userId = :id";
    // if (data && data.timeperiod) {
    //   // change created on to updatedon if we are using proposal  table, otherwise join with discussion table and use created on
    //   if (whereClause.length) whereClause += " and ";
    //   if (data.timeperiod == "today") {
    //     whereClause += " DATE(sp.updatedOn) = CURDATE()";
    //   } else if (data.timeperiod == "weekly") {
    //     whereClause += " sp.updatedOn >= DATE(NOW()) - INTERVAL 7 DAY";
    //   } else if (data.timeperiod == "monthly") {
    //     whereClause += " MONTH(sp.updatedOn) = MONTH(CURDATE())";
    //   } else if (data.timeperiod == "last3months") {
    //     whereClause += "sp.updatedOn >= DATE(NOW()) - INTERVAL 3 MONTH"
    //   } else if (data.timeperiod == "last6months") {
    //     whereClause += "sp.updatedOn >= DATE(NOW()) - INTERVAL 6 MONTH"
    //   } else if (data.timeperiod == "1year") {
    //     whereClause += "sp.updatedOn >= DATE(NOW()) - INTERVAL 12 MONTH "
    //   }
    // }
    // if (whereClause.length) {
    //   query += `WHERE ${whereClause}`
    // }
    // query += " Group by u.id";

    //console.log('whereClause---', whereClause);
    return utility.query(query, data);
  },
  yearlysalesTarget: function (data) {
    if (data && data.timeperiod == "yearlysalesTarget") {
      var query =
        `SELECT MONTH(r.createdOn) as month,sum(r.actualRevenue) as Revenue,r.createdOn,r.resourceId,tst.employeeTarget,((tst.employeeTarget)-sum(r.actualRevenue)) as pending FROM tblRevenueReports r`;
      query += " INNER JOIN tblsalesTarget tst on tst.userId = r.resourceId ";
      if (data && data.id) {
        query += " WHERE r.resourceId = :id ";
      }
      query += " Group by month  "
      return utility.query(query, data);
    }
  },

  addsalesTarget: function (data) {
    var query =
      "INSERT INTO tblsalesTarget(guid, userId, employeeTarget,isActive,createdOn) VALUES(:guid, :userId, :employeeTarget,:isActive,now())";
    return utility.query(query, data);
  },
  getTarget: function (data) {
    var query =
      "SELECT t.*,u.firstName,u.lastName,u.email,u.skills,u.dob,u.userKra FROM tblsalesTarget t";
    query += " INNER JOIN tblusers u on u.id = t.userId "
    if (data && data.id) {
      query += " WHERE t.id = :id";
    }
    return utility.query(query, data);
  },
  editTarget: function (data) {
    var query = "UPDATE tblsalesTarget SET";

    if (data && data.employeeTarget) {
      query += " employeeTarget = :employeeTarget";
    }
    if (data && data.id) {
      query += " WHERE id=:id";
    }
    return utility.query(query, data);
  },
};



