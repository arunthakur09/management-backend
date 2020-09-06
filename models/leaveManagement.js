var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");

module.exports = {
  addLeaveManagFields: function (data) {
    var query =
      "INSERT INTO tblLeaveManagement(userId,guid, leaveType,dateFrom,dateTo,departmentHead,reason,leaveDuration,shift,leaveTime,status, isActive, createdOn) VALUES( :userId,:guid, :leaveType,:dateFrom,:dateTo,:departmentHead,:reason,:leaveDuration,:shift,:leaveTime,:status, :isActive, now())";
    return utility.query(query, data);
  },
  getLeaveManagFields: function (data) {
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
    if (data.roleId == 3 && data.userId !== 3) {
      whereClause += " l.userId = :userId"
      if (data.id) {
        whereClause += " AND l.id = :id"
      }
    } else {
      if (data.id) {
        whereClause += " l.id = :id"
      }
    }
    if (data && data.userid) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " l.userId = :userid"
    }
    if (data && data.status) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " status = :status"
    }
    if (data && data.timePeriod) {
      if (whereClause.length) whereClause += " and ";
      if (data.timePeriod == "today") {
        whereClause += " DATE(l.createdOn) = CURDATE()";
      } else if (data.timePeriod == "weekly") {
        whereClause += " l.createdOn >= DATE(NOW()) - INTERVAL 7 DAY";
      } else if (data.timePeriod == "monthly") {
        whereClause += " MONTH(l.createdOn) = MONTH(CURDATE())";
      } else if (data.timePeriod == "last3months") {
        whereClause += " l.createdOn >= DATE(NOW()) - INTERVAL 3 MONTH";
      } else if (data.timePeriod == "last6months") {
        whereClause += " l.createdOn >= DATE(NOW()) - INTERVAL 6 MONTH";
      } else if (data.timePeriod == "1year") {
        whereClause += " YEAR(l.createdOn) = YEAR(CURDATE())";
      }
    }
    if (data && data.from && data.to) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " l.createdOn BETWEEN :from AND :to "
    }
    if (whereClause.length) {
      whereClause = " WHERE" + whereClause;
    }
    var query = `SELECT(
      SELECT COUNT(*) FROM tblLeaveManagement l ${whereClause}
    ) as count,l.*,${data.totalMonths} as totalLeaves , u.firstName, u.lastName FROM tblLeaveManagement l INNER JOIN tblusers u on l.userId = u.id ${whereClause}`;

    return utility.query(query, data);
  },
  getyearlyLeave: function (data) {
    var query = "SELECT MONTH(l.createdOn) as month,count(*) as count FROM `tblLeaveManagement` l "
    if (data && data.userid) {
      query += " WHERE l.userId = :userid"
    }
    query += " GROUP BY MONTH(l.createdOn)"
    return utility.query(query, data);
  },
  editLeaveManagFields: function (data) {
    var query = "UPDATE tblLeaveManagement SET";
    if (data && data.leaveType) {
      query += " leaveType = :leaveType,";
    }
    if (data && data.status) {
      query += " status = :status,";
    }
    if (data && data.dateFrom) {
      query += " dateFrom = :dateFrom,";
    }
    if (data && data.dateTo) {
      query += " dateTo = :dateTo,";
    }
    if (data && data.departmentHead) {
      query += " departmentHead = :departmentHead,";
    }
    if (data && data.reason) {
      query += " reason = :reason,";
    }
    if (data && data.leaveDuration) {
      query += " leaveDuration = :leaveDuration,";
    }
    if (data && data.leaveTime) {
      query += " leaveTime = :leaveTime,";
    }
    if (data && data.shift) {
      query += " shift = :shift,";
    }
    if (data && "isActive" in data) {
      query += " isActive = :isActive";
    }
    if (data && data.id) {
      query += " WHERE id=:id";
    }
    return utility.query(query, data);
  },
  deleteLeaveManagFields: function (data) {
    var query = "UPDATE tbldepartments SET isActive = 0 WHERE id = :id";
    return utility.query(query, data);
  },
  addleaveRecord: function (data) {
    var query =
      "INSERT INTO tblLeaveTypeManagement(userId, leaveType, paid, unpaid,month,isActive,createdOn) VALUES(:userId, :leaveType, :paid,:unpaid,:month, :isActive, now())";
    return utility.query(query, data);
  },
  getleaveRecord: function (data) {
    var query = "SELECT * FROM tblLeaveTypeManagement";
    if (data && data.id) {
      query += " WHERE userId = :id && month = MONTH(CURDATE())";
    }
    return utility.query(query, data);
  },
  getCountFields: function (data) {
    var query = `SELECT COUNT(*) as leaves,u.id, CONCAT(u.firstName, ' ', u.lastName) as fullName from tblLeaveManagement l`
    query += ` INNER JOIN tblusers u on l.userId = u.id`
    query += ` GROUP BY l.userId`
    return utility.query(query, data)
  },
};
