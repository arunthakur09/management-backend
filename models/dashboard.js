var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");
module.exports = {
    getAttendance: (data) => {
        var query =
            `SELECT u.userImage,CONCAT(u.firstName, ' ' , u.lastName, '') as firstName,l.checkInDate, u.id, 
            case 
            when l.checkInDate = DATE(NOW()) then 1 
            ELSE 0 
            end as present_count 
            FROM tblusers u LEFT JOIN tbltimelog l on l.userId= u.id and l.checkInDate = DATE(NOW())  ORDER BY l.checkInDate desc`
        return utility.query(query, data);
    },
    getBirthday: (data) => {
        var query = "SELECT u.id,CONCAT(u.firstName, ' ' , u.lastName, '') as firstName,u.dob,u.userImage,u.jobTitle FROM tblusers u WHERE MONTH(u.dob) = MONTH(DATE(NOW())) ORDER BY u.dob"
        return utility.query(query, data);
    },
    dashboardHoliday: (data) => {
        var query = `SELECT h.*, DAYNAME(h.fromDate) as day FROM tblHoliday h WHERE h.fromDate >= NOW() `;
        return utility.query(query, data);
    },
    getDepartmet: (data) => {
        var query = "SELECT u.id,u.userImage,u.isDepartmentHead, CONCAT(u.firstName, ' ' , u.lastName, '') as Name, td.departmentName FROM tbluserdepartment d "
        query += " INNER JOIN tbldepartments td on td.id = d.departmentId"
        query += " INNER JOIN tblusers u on u.id = d.userId WHERE u.isDepartmentHead=1"
        return utility.query(query, data)
    },
    getCount: (data) => {
        var whereClause = ''
        var query = `SELECT COUNT(*) as Count, gender FROM tblusers u ${whereClause}`
        if (whereClause.length) {
            query += `WHERE ${whereClause}`
        }
        query += ` GROUP BY u.gender`
        return utility.query(query, data);
    },
    newHire: (data) => {
        var query = `SELECT u.id,u.userImage, CONCAT(u.firstName, ' ' , u.lastName, '') as firstName, u.joiningDate from tblusers u WHERE u.joiningDate >= DATE(NOW()) - INTERVAL 1 MONTH ORDER BY u.joiningDate`
        return utility.query(query, data);
    },
    getLeaves: (data) => {
        var query = `SELECT CONCAT(u.firstName, ' ' , u.lastName, '') as Name, u.userImage, l.id, l.leaveType, l.status, l.reason,l.dateFrom FROM tblLeaveManagement l`
        query += ` INNER JOIN tblusers u on u.id = l.userId WHERE l.dateFrom >= DATE(NOW()) - INTERVAL 1 MONTH ORDER BY l.dateFrom`
        return utility.query(query, data)
    },
    presentCount: (data) => {
        var query = `SELECT COUNT(case when l.checkInDate = DATE(NOW()) then 1 else null end) as count FROM tblusers u LEFT JOIN tbltimelog l on l.userId= u.id`
        return utility.query(query, data)
    },
    followUp: (data) => {
        var query = `SELECT followUpDate,comment,followUpTime,id from tblproposalsubmission as p WHERE MONTH(p.followUpDate) = MONTH(now())`
        return utility.query(query, data)
    }

}