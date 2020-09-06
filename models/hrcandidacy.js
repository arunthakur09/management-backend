var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");

module.exports = {
  addCandidacyFields: function (data) {

    var query =
      "INSERT INTO tblHrCandidacy(guid,candidateName,email,skills,experience,rounds,currentSalary,expectedSalary,noticePeriod,interviewDate,interviewTime,interviewMode,reasonForChange,outcome,hiringManager,userId,phone,status,source,qualification,resume,isActive,createdOn) VALUES(:guid,:candidateName,:email,:skills,:experience,:rounds,:currentSalary,:expectedSalary,:noticePeriod,:interviewDate,:interviewTime,:interviewMode,:reasonForChange,:outcome,:hiringManager,:userId,:phone,:status,:source,:qualification,:resume,:isActive,now())";
    return utility.query(query, data)
  },
  getCandidacyFields: function (data) {

    var whereClause = "";
    if (data && data.id) {
      whereClause += " h.id = :id";
    }
    if (data && !data.id && data.userId) {
      whereClause += " h.userId = :userId"
    }
    if (data && data.outcome) {
      if (whereClause.length) whereClause += " and "
      whereClause += " h.outcome = :outcome"
    }
    if (data && data.skills) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " h.skills = :skills"
    }
    if (data && data.candidateName) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " h.candidateName = :candidateName"
    }
    if (data && data.source) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " h.source = :source"
    }
    if (data && data.month) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " MONTH(h.createdOn) = :month";
    }
    if (data && data.isActive) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " h.isActive = :isActive"
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
      whereClause = " WHERE" + whereClause;
    }
    var query = `SELECT(
      SELECT COUNT(*) FROM tblHrCandidacy h ${whereClause} 
    )as count,u.firstName,h.id,h.resume,h.status,MONTH(h.createdOn) as month,h.source,h.guid,h.phone,h.outcome,h.qualification,h.candidateName,h.email,h.skills,h.experience,h.rounds,h.currentSalary,h.expectedSalary,h.hiringManager,h.noticePeriod,h.interviewDate,h.interviewTime,h.interviewMode,h.reasonForChange,(Case When h.isActive=1 Then 1 Else 0 End) AS isActive,h.userId, h.createdOn FROM tblHrCandidacy h INNER JOIN tblusers u ON u.id = h.userId ${whereClause} `;

    return utility.query(query, data);
  },
  editCandidacyFields: function (data) {
    var query = "UPDATE tblHrCandidacy SET";
    if (data && data.candidateName) {
      query += " candidateName = :candidateName,";
    }
    if (data && data.email) {
      query += " email = :email,";
    }
    if (data && data.skills) {
      query += " skills = :skills,";
    }

    if (data && data.rounds) {
      query += " rounds = :rounds,";
    }
    if (data && data.phone) {
      query += " phone = :phone,";
    }
    if (data && data.source) {
      query += " source = :source,";
    }
    if (data && data.status) {
      query += " status = :status,";
    }
    if (data && data.experience) {
      query += " experience = :experience,";
    }
    if (data && data.currentSalary) {
      query += " currentSalary = :currentSalary,";
    }
    if (data && data.expectedSalary) {
      query += " expectedSalary = :expectedSalary,";
    }
    if (data && data.noticePeriod) {
      query += " noticePeriod = :noticePeriod,";
    }
    if (data && data.interviewDate) {
      query += " interviewDate = :interviewDate,";
    }
    if (data && data.interviewTime) {
      query += " interviewTime = :interviewTime,";
    }
    if (data && data.interviewMode) {
      query += " interviewMode = :interviewMode,";
    }
    if (data && data.reasonForChange) {
      query += " reasonForChange = :reasonForChange,";
    }
    if (data && data.hiringManager) {
      query += " hiringManager = :hiringManager,";
    }
    if (data && data.outcome) {
      query += " outcome = :outcome,";
    }
    if (data && data.resume) {
      query += " resume = :resume";
    }
    if (data && "isActive" in data) {
      query += " isActive = :isActive";
    }
    if (data && data.id) {
      query += " WHERE id=:id";
    }
    return utility.query(query, data);
  },
  deleteCandidacyFields: function (data) {
    var query = "UPDATE tblHrCandidacy SET isActive = 0 WHERE id = :id";
    return utility.query(query, data);
  }
};
