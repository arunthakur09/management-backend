var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");

module.exports = {
    addRevenues: function (data) {
        var query =
            "INSERT INTO tblRevenueReports(guid, clientName,resourceId,upworkId,hourlyRate,weeklyRevenue,month,hours,week1,week2,week3,week4,week5,totalRevenue,actualRevenue,projectTitle,startDate,endDate,deadlineDate,fromTo,milestone,projectType,createdOn) VALUES(:guid,:clientName,:resourceId,:upworkId,:hourlyRate,:weeklyRevenue,:month,:hours,:week1,:week2,:week3,:week4,:week5,:totalRevenue,:actualRevenue,:projectTitle,:startDate,:endDate,:deadlineDate,:fromTo,:milestone,:projectType,now())";
        return utility.query(query, data);
    },
    getRevenues: function (data) {

        var whereClause = "";
        var query = `SELECT (
            SELECT sum(r.actualRevenue)  FROM tblRevenueReports r
            )as overallRevenues,r.id,r.milestone, r.guid,r.clientName,u.firstName,r.resourceId,r.month,r.upworkId,r.hourlyRate,r.projectTitle,r.weeklyRevenue,r.projectType,r.hours,r.week1,r.week2,r.week3,r.week4,r.week5,r.totalRevenue,r.actualRevenue,r.startDate,r.endDate,r.deadlineDate,r.fromTo,(Case When r.isActive=1 Then 1 Else 0 End) AS isActive FROM tblRevenueReports r`;
        query += ` INNER JOIN tblusers u ON u.id = r.resourceId ${whereClause} `;
        if (data.roleId == 3 && data.userId) {
            if (data.userId !== 7) {
                whereClause += " r.resourceId = :userId"
            }
        }
        if (data && data.id) {
            if (whereClause.length) whereClause += " and ";
            whereClause += " r.id = :id  ";
        }
        if (data && data.timeperiod) {
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
        if (data && data.from && data.to) {
            if (whereClause.length) whereClause += " and ";
            whereClause += " r.createdOn BETWEEN :from AND :to "
        }
        if (data && data.month) {
            if (whereClause.length) whereClause += " and ";
            whereClause += " r.month = :month"
        }
        if (data && data.projectType) {
            if (whereClause.length) whereClause += " and ";
            whereClause += " r.projectType = :projectType"
        }
        if (whereClause.length) {
            query += `WHERE ${whereClause}`
        }
        return utility.query(query, data);
    },
    getTotalRevenues: function (data) {
        var query =
            `SELECT sum(SUBSTRING(week1, -3, 3)) As totalweek1,sum(SUBSTRING(week2, -3, 3)) As totalweek2,sum(SUBSTRING(week3, -3, 3)) As totalweek3,sum(SUBSTRING(week4, -3, 3)) As totalweek4,sum(SUBSTRING(week5, -3, 3)) As totalweek5  FROM tblRevenueReports`;
        if (data && data.id) {
            query += " WHERE id = :id  ";
        }
        if (data && data.month) {
            query += " WHERE month = :month"
        }

        return utility.query(query, data);
    },
    editRevenues: function (data) {
        var query = "UPDATE tblRevenueReports SET";
        if (data && data.clientName) {
            query += " clientName = :clientName";
        }
        if (data && data.resource) {
            query += " ,resourceId = :resourceId";
        }
        if (data && data.upworkId) {
            query += " ,upworkId = :upworkId";
        }
        if (data && data.hourlyRate) {
            query += " ,hourlyRate = :hourlyRate";
        }
        if (data && data.weeklyRevenue) {
            query += " ,weeklyRevenue = :weeklyRevenue";
        }
        if (data && data.hours) {
            query += " ,hours = :hours";
        }
        if (data && data.week1) {
            query += " ,week1 = :week1";
        }
        if (data && data.week2 && data) {
            query += " ,week2 = :week2";
        }
        if (data && data.week3) {
            query += " ,week3 = :week3";
        }
        if (data && data.week4) {
            query += " ,week4 = :week4";
        }
        if (data && data.week5) {
            query += " ,week5 = :week5";
        }
        if (data && data.actualRevenue) {
            query += " ,actualRevenue = :actualRevenue";
        }
        if (data && data.fromTo) {
            query += " ,fromTo = :fromTo";
        }
        if (data && data.milestone) {
            query += " ,milestone = :milestone";
        }

        if (data && data.id) {
            query += " WHERE id=:id";
        }

        return utility.query(query, data);
    },
    deleteRevenues: function (data) {
        var query = "UPDATE tblRevenueReports SET isActive = 0 WHERE id = :id";
        return utility.query(query, data);
    },
    yearlyRevenues: function (data) {
        var query =
            `SELECT MONTH(r.createdOn) as month,sum(r.actualRevenue) as Revenue,r.createdOn,r.resourceId,tst.employeeTarget,((tst.employeeTarget)-sum(r.actualRevenue)) as pending FROM tblRevenueReports r`;
        query += " INNER JOIN tblsalesTarget tst on tst.userId = r.resourceId ";
        query += " Group by month  "
        return utility.query(query, data);

    },


}