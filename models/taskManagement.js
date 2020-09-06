var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");

module.exports = {
    addTask: function (data) {
        var query =
            "INSERT INTO tblTaskManagement(guid,userId,projectId,taskName,taskDetails,deadlineDate,deadlineTime,spendingHours,workedOn, isActive, createdOn) VALUES(:guid, :userId, :projectId, :taskName,:taskDetails,:deadlineDate,:deadlineTime,:spendingHours,:workedOn, :isActive, now())";
        return utility.query(query, data);
    },

    getTask: function (data) {
        console.log('data', data)
        var whereClause = "";
        if (data && data.id) {
            if (whereClause.length) whereClause += " and ";
            whereClause += " t.id = :id";
        }
        if (data && data.month) {
            if (whereClause.length) whereClause += " and ";
            whereClause += " MONTH(t.workedOn) = :month";
        }
        if (data && data.taskName) {
            if (whereClause.length) whereClause += " and ";
            whereClause += " t.taskName = :taskName";
        }
        if (whereClause.length) {
            whereClause = " WHERE" + whereClause;
        }
        var query = ` SELECT t.*, MONTH(t.workedOn) as month, ps.submissionTitle, CONCAT(u.firstName, ' ' , u.lastName, '') as Name from tblTaskManagement t  `
        query += ` INNER JOIN tblusers u on u.id = t.userId `
        query += ` INNER JOIN tblproposalsubmission ps on ps.id = t.projectId ${whereClause}`
        return utility.query(query, data);
    },
    editTask: function (data) {
        var query = "UPDATE tblTaskManagement SET";
        if (data && data.userId) {
            query += " userId = :userId,";
        }
        if (data && data.projectId) {
            query += " projectId = :projectId,";
        }
        if (data && data.taskName) {
            query += " taskName = :taskName,";
        }
        if (data && data.taskDetails) {
            query += " taskDetails = :taskDetails,";
        }
        if (data && data.deadlineTime) {
            query += " deadlineTime = :deadlineTime,";
        }
        if (data && data.deadlineDate) {
            query += " deadlineDate = :deadlineDate,";
        }
        if (data && data.workedOn) {
            query += " workedOn = :workedOn,";
        }
        if (data && data.spendingHours) {
            query += " spendingHours = :spendingHours,";
        }
        if (data && "isActive" in data) {
            query += " isActive = :isActive";
        }
        if (data && data.id) {
            query += " WHERE id=:id";
        }
        return utility.query(query, data);
    },

    deleteTask: function (data) {
        var query = "UPDATE tblTaskManagement SET isActive = 0 WHERE id = :id";
        return utility.query(query, data);
    }
};
