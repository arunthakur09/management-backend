var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");

module.exports = {
    addProjectDetails: function (data) {
        var query =
            "INSERT INTO tblProjectManagement(guid, title,description,status,startDate,endDate,customerDeadline,clientName,taskPresets,commentFallback,person,projectRole,comment,dealsId,isActive, createdOn) VALUES(:guid, :title,:description,:status,:startDate,:endDate,:customerDeadline,:clientName,:taskPresets,:commentFallback,:person,:projectRole,:comment,:dealsId,:isActive, now())";
        return utility.query(query, data);
    },
    getProjectDetails: function (data) {
        var query =
            "SELECT m.*,CONCAT(u.firstName, ' ' , u.lastName, '') as contractorName,CONCAT(u.firstName, ' ' , u.lastName, '') as fullName,p.portal as source,p.jobRequirement as jobRequirement,p.company as companyName,p.userId as userid FROM tblProjectManagement m";

        query += " INNER JOIN tblusers u ON u.id = m.person";

        query += " INNER JOIN tblproposalsubmission p on p.id = m.dealsId"
        query += " INNER JOIN tblusers s ON s.id = p.userId";
        if (data && data.id) {
            query += " WHERE m.id = :id";
        }
        return utility.query(query, data);
    },
    editProjectDetails: function (data) {
        var query = "UPDATE tblProjectManagement SET";
        if (data && data.title) {
            query += " title = :title,";
        }
        if (data && data.description) {
            query += " description = :description,";
        }
        if (data && data.status) {
            query += " status = :status,";
        }
        if (data && data.startDate) {
            query += " startDate = :startDate,";
        }
        if (data && data.endDate) {
            query += " endDate = :endDate,";
        }
        if (data && data.customerDeadline) {
            query += " customerDeadline = :customerDeadline,";
        }
        if (data && data.customerId) {
            query += " clientName = :clientName,";
        }
        if (data && data.taskPresets) {
            query += " taskPresets = :taskPresets,";
        }
        if (data && data.commentFallback) {
            query += " commentFallback = :commentFallback,";
        }
        if (data && data.person) {
            query += " person = :person,";
        }
        if (data && data.projectRole) {
            query += " projectRole = :projectRole,";
        }
        if (data && data.comment) {
            query += " comment = :comment,";
        }

        if (data && "isActive" in data) {
            query += " isActive = :isActive";
        }

        if (data && data.id) {
            query += " WHERE id=:id";
        }
        return utility.query(query, data);
    },


};
