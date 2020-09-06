var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");

module.exports = {
    addhris: function (data) {
        var query =
            "INSERT INTO tblHRIS(guid,userId,designation,exBeforeJoin,exAfterJoin,referenceContact,slackId,slackPassword,increment,reasonOfWork,served,comments,remarks,exitFormalities,temporaryAddress,skillOfInterest,slackNewPassword,gmailId,gmailPassword,gmailNewPassword,incrementDate,isActive, createdOn) VALUES(:guid,:userId,:designation,:exBeforeJoin,:exAfterJoin,:referenceContact,:slackId,:slackPassword,:increment,:reasonOfWork,:served,:comments,:remarks,:exitFormalities,:temporaryAddress,:skillOfInterest,:slackNewPassword,:gmailId,:gmailPassword,:gmailNewPassword,:incrementDate,:isActive, now())";
        return utility.query(query, data);
    },
    gethris: function (data) {
        var whereClause = "";
        if (data && data.id) {
            if (whereClause.length) whereClause += " and ";
            whereClause += " hr.id = :id";
        }
        if (data && data.userId) {
            if (whereClause.length) whereClause += " and ";
            whereClause += " hr.userId = :userId";
        }
        if (data && data.month) {
            if (whereClause.length) whereClause += " and ";
            whereClause += " MONTH(hr.createdOn) = :month";
        }
        if (data && data.timePeriod) {
            if (whereClause.length) whereClause += " and ";
            if (data.timePeriod == "today") {
                whereClause += " DATE(hr.createdOn) = CURDATE()";
            } else if (data.timePeriod == "weekly") {
                whereClause += " hr.createdOn >= DATE(NOW()) - INTERVAL 7 DAY";
            } else if (data.timePeriod == "monthly") {
                whereClause += " MONTH(hr.createdOn) = MONTH(CURDATE())";
            } else if (data.timePeriod == "last3months") {
                whereClause += " hr.createdOn >= DATE(NOW()) - INTERVAL 3 MONTH"
            } else if (data.timePeriod == "last6months") {
                whereClause += " hr.createdOn >= DATE(NOW()) - INTERVAL 6 MONTH"
            } else if (data.timeperiod == "1year") {
                whereClause += " hr.createdOn >= DATE(NOW()) - INTERVAL 12 MONTH "
            }
        }
        if (whereClause.length) {
            whereClause = " WHERE" + whereClause;
        }
        var query =
            "SELECT hr.*,MONTH(hr.createdOn) as month,u.firstName,u.lastName,u.dob,u.phoneP,u.streetAddress,u.emailP,u.email,u.password,u.skills,u.ResignedDate,u.employeeStatus,u.joiningDate FROM tblHRIS hr";
        query += ` INNER JOIN tblusers u ON u.id = hr.userId ${whereClause}`;

        return utility.query(query, data);
    },
    edithris: function (data) {
        var query = "UPDATE tblHRIS SET";
        if (data && data.designation) {
            query += " designation = :designation,";
        }

        if (data && data.exBeforeJoin) {
            query += " exBeforeJoin = :exBeforeJoin,";
        }
        if (data && data.exAfterJoin) {
            query += " exAfterJoin = :exAfterJoin,";
        }
        if (data && data.referenceContact) {
            query += " referenceContact = :referenceContact,";
        }
        if (data && data.slackId) {
            query += " slackId = :slackId,";
        }
        if (data && data.slackPassword) {
            query += " slackPassword = :slackPassword,";
        }
        if (data && data.increment) {
            query += " increment = :increment,";
        }
        if (data && data.slackNewPassword) {
            query += " slackNewPassword = :slackNewPassword,";
        }
        if (data && data.temporaryAddress) {
            query += " temporaryAddress = :temporaryAddress,";
        }
        if (data && data.reasonOfWork) {
            query += " reasonOfWork = :reasonOfWork,";
        }
        if (data && data.served) {
            query += " served = :served,";
        }
        if (data && data.skillOfInterest) {
            query += " skillOfInterest = :skillOfInterest,";
        }
        if (data && data.comments) {
            query += " comments = :comments,";
        }
        if (data && data.remarks) {
            query += " remarks = :remarks,";
        }
        if (data && data.exitFormalities) {
            query += " exitFormalities = :exitFormalities,";
        }
        if (data && data.gmailId) {
            query += " gmailId = :gmailId,";
        }
        if (data && data.gmailPassword) {
            query += " gmailPassword = :gmailPassword,";
        }
        if (data && data.gmailNewPassword) {
            query += " gmailNewPassword = :gmailNewPassword,";
        }
        if (data && data.increamentDate) {
            query += " incrementDate = :incrementDate,";
        }

        if (data && "isActive" in data) {
            query += " isActive = :isActive";
        }

        if (data && data.id) {
            query += " WHERE id=:id";
        }
        return utility.query(query, data);
    },

    deleteDepartment: function (data) {
        var query = "UPDATE tbldepartments SET isActive = 0 WHERE id = :id";
        return utility.query(query, data);
    }
};
