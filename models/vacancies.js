var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");

module.exports = {
    addVacancies: function (data) {
        var query =
            "INSERT INTO tblHRTarget(guid, jobTitle, assignedPositions,hiringManager,positions,description,targetMet, isActive, createdOn) VALUES(:guid, :jobTitle, :assignedPositions,:hiringManager,:positions,:description,:targetMet,:isActive, now())";
        return utility.query(query, data);
    },
    getVacancies: function (data) {
        var whereClause = '';
        var query =
            "SELECT h.*,CONCAT(u.firstName, ' ', u.lastName) as firstName FROM tblHRTarget h";
        query += " INNER JOIN tblusers u ON u.id = h.hiringManager ";
        // query += ` INNER JOIN tblHrCandidacy hr ON hr.userId = h.hiringManager ${whereClause}`
        if (data && data.id) {
            whereClause += " h.id = :id";
        }
        if (data && data.hiringManager) {
            whereClause += " h.hiringManager = :hiringManager";
        }
        if (data && data.jobTitle) {
            whereClause += " h.jobTitle = :jobTitle";
        }
        if (data && data.timePeriod) {
            if (whereClause.length) whereClause += " and ";
            if (data.timePeriod == "today") {
                whereClause += " DATE(h.createdOn) = CURDATE()";
            } else if (data.timePeriod == "weekly") {
                whereClause += " h.createdOn >= DATE(NOW()) - INTERVAL 7 DAY";
            } else if (data.timePeriod == "monthly") {
                whereClause += " MONTH(h.createdOn) = MONTH(CURDATE())";
            } else if (data.timePeriod == "last3months") {
                whereClause += " h.createdOn >= DATE(NOW()) - INTERVAL 3 MONTH";
            } else if (data.timePeriod == "last6months") {
                whereClause += " h.createdOn >= DATE(NOW()) - INTERVAL 6 MONTH";
            } else if (data.timePeriod == "1year") {
                whereClause += " YEAR(h.createdOn) = YEAR(CURDATE())";
            }
        }
        if (data && data.from && data.to) {
            if (whereClause.length) whereClause += " and ";
            whereClause += " h.createdOn BETWEEN :from AND :to "
        }
        if (whereClause.length) {
            query += `WHERE ${whereClause}`
        }
        return utility.query(query, data);
    },
    editVacancies: function (data) {
        var query = "UPDATE tblHRTarget SET";
        if (data && data.jobTitle) {
            query += " jobTitle = :jobTitle,";
        }
        if (data && data.assignedPositions) {
            query += " assignedPositions = :assignedPositions,";
        }
        if (data && data.hiringManager) {
            query += " hiringManager = :hiringManager,";
        }
        if (data && data.positions) {
            query += " positions = :positions,";
        }
        if (data && data.description) {
            query += " description = :description,";
        }
        if (data && data.targetMet) {
            query += " targetMet = :targetMet,";
        }
        if (data && "isActive" in data) {
            query += " isActive = :isActive";
        }
        if (data && data.id) {
            query += " WHERE id=:id";
        }
        return utility.query(query, data);
    },

    deleteVacancies: function (data) {
        var query = "UPDATE tblHRTarget SET isActive = 0 WHERE id = :id";
        return utility.query(query, data);
    },



    // var query = `SELECT (
    //     SELECT sum(r.actualRevenue)  FROM tblRevenueReports r
    //     )as overallRevenues,r.id,r.milestone, r.guid,r.clientName,u.firstName,r.resourceId,r.month,r.upworkId,r.hourlyRate,r.projectTitle,r.weeklyRevenue,r.projectType,r.hours,r.week1,r.week2,r.week3,r.week4,r.week5,r.totalRevenue,r.actualRevenue,r.startDate,r.endDate,r.deadlineDate,r.fromTo,(Case When r.isActive=1 Then 1 Else 0 End) AS isActive FROM tblRevenueReports r`;
    // query += " INNER JOIN tblusers u ON u.id = r.resourceId ";
    // if (data.roleId == 3 && data.userId) {
    //     if (data.userId !== 7) {
    //         query += " WHERE r.resourceId = :userId"
    //     }
    // }

    getHrtarget: function (data) {
        var whereClause = "";

        var query = `SELECT(
            SELECT count(*) from tblHrCandidacy h where h.outcome='selected'
        ) as Selected,sum(hr.positions) as positions,u.id,CONCAT(u.firstName, ' ', u.lastName) as fullName from tblHrCandidacy h `;
        query += " INNER JOIN tblHRTarget hr on hr.hiringManager = h.userId "
        query += " INNER JOIN tblusers u on u.id = h.userId "
        if (data) {
            whereClause += " h.outcome = 'selected' ";
        }
        if (data && data.userId) {
            whereClause += " AND h.userId = :userId"
        }
        if (data && data.from && data.to) {
            if (whereClause.length) whereClause += " and ";
            whereClause += " h.createdOn BETWEEN :from AND :to "
        }
        if (whereClause.length) {
            query += `WHERE ${whereClause}`
        }
        query += " Group by h.userId";
        return utility.query(query, data);
    },
    selectedTargetCount: (data) => {
        var query = `SELECT count(*) as Selected, h.hiringManager from tblHRTarget h`
        query += ` GROUP BY h.hiringManager`
        return utility.query(query, data)
    },
};
