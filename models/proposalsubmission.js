var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");

module.exports = {
  addProposalFields: function (data) {
    var query =
      "INSERT INTO tblproposalsubmission(guid, userId, profile, date,portal,status,clientName,countryCityState,company,email,phone,domain,submissionTitle,pitchContent,jobReqLink,proposalLink,clientPostedDateTime,projectType,proposalSubmissionDateTime,proposalTime,jobRequirement,hourlyRate,upworkId,emailP,phoneP,linkedInProfile,budget,rating,companyEmail,patternEmail,clientDesignation,leadStatus,companyUrl,companyPhone,companylinkedInProfile,followUpDate,followUpTime,comment,isActive,createdOn) VALUES(:guid, :userId, :profile,:date,:portal,:status,:clientName,:countryCityState,:company,:email,:phone,:domain,:submissionTitle,:pitchContent,:jobReqLink,:proposalLink,:clientPostedDateTime,:projectType,:proposalSubmissionDateTime,:proposalTime,:jobRequirement,:hourlyRate,:upworkId,:emailP,:phoneP,:linkedInProfile,:budget,:rating,:companyEmail,:patternEmail,:clientDesignation,:leadStatus,:companyUrl,:companyPhone,:companylinkedInProfile,:followUpDate,:followUpTime,:comment,:isActive,now())";
    return utility.query(query, data);
  },
  getProposalFields: function (data) {
    var whereClause = "";
    if (data && data.id) {
      if (whereClause.length) whereClause += " and "
      whereClause += " id = :id ";
    }
    if (data && data.status) {
      if (whereClause.length) whereClause += " and "
      whereClause += " status = :status ";
    }
    if (whereClause.length) {
      whereClause = " WHERE" + whereClause;
    }
    var query = `SELECT * FROM tblproposalsubmission ${whereClause}`;
    return utility.query(query, data);

  },
  getProposal: function (data) {
    var query = "SELECT sum(rating)/count(*) as Avg FROM tblproposalsubmission ";
    if (data && data.userId) {
      if (data.userId !== 7) {
        query += " WHERE userId = :userId ";
      }
      else {
        query += " WHERE userId = :userId ";
      }
    }
    return utility.query(query, data);
  },
  getTotalField: (data) => {
    var query =
      "SELECT COUNT(status) as count, status FROM tblproposalsubmission ";
    if (data && data.userId) {
      if (data.userId !== 7) {
        query +=
          " WHERE userId = :userId GROUP BY status"
      } else {
        query += " WHERE userId = :userId GROUP BY status"
      }
    }
    else {
      query += ' GROUP BY status'
    }
    return utility.query(query, data);
  },

  getProposalUserFields: function (data) {
    var whereClause = "";
    if (data && data.userId) {
      whereClause += " p.userId = :userId";
    }
    if (data && data.portal) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " p.portal = :portal";
    }
    if (data && data.timePeriod) {
      if (whereClause.length) whereClause += " and ";
      if (data.timePeriod == "today") {
        whereClause += " DATE(p.createdOn) = CURDATE()";
      } else if (data.timePeriod == "weekly") {
        whereClause += " p.createdOn >= DATE(NOW()) - INTERVAL 7 DAY";
      } else if (data.timePeriod == "monthly") {
        whereClause += " MONTH(p.createdOn) = MONTH(CURDATE())";
      } else if (data.timePeriod == "last3months") {
        whereClause += " p.createdOn >= DATE(NOW()) - INTERVAL 3 MONTH"
      } else if (data.timePeriod == "last6months") {
        whereClause += " p.createdOn >= DATE(NOW()) - INTERVAL 6 MONTH"
      } else if (data.timeperiod == "1year") {
        whereClause += "p.createdOn >= DATE(NOW()) - INTERVAL 12 MONTH "
      }
    }
    if (data && data.from && data.to) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " p.createdOn BETWEEN :from AND :to "
    }
    if (data && data.status) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " p.status = :status";
    }
    if (data && data.clientName) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " p.clientName = :clientName";
    }
    if (data && data.domain) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " p.domain = :domain";
    }
    if (data && data.month) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " MONTH(p.createdOn) = :month";
    }
    if (whereClause.length) {
      whereClause = " WHERE" + whereClause;
    }
    var query = `SELECT (
        SELECT COUNT(*) as count5 FROM tblproposalsubmission p
        INNER JOIN tblusers u ON u.id = p.userId ${whereClause}
      ) as totalRecords
    , p.*,MONTH(p.createdOn) as month,u.firstName,u.userImage,u.jobTitle,u.streetAddress,u.phoneP,u.phoneW,u.nationality,u.maritalStatus,u.lastName,u.skills,u.dob,u.gender,u.email FROM tblproposalsubmission p `;
    query += `INNER JOIN tblusers u ON u.id = p.userId`;
    query += ` ${whereClause} LIMIT ${data.limit} OFFSET ${data.offset}`;

    return utility.query(query, data);
  },
  getproposalCount: function (data) {
    var whereClause = "";
    if (data && data.userId) {
      whereClause += " p.userId = :userId";
    }
    if (data && data.portal) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " p.portal = :portal";
    }
    if (data && data.timePeriod) {
      if (whereClause.length) whereClause += " and ";
      if (data.timePeriod == "today") {
        whereClause += " DATE(p.createdOn) = CURDATE()";
      } else if (data.timePeriod == "weekly") {
        whereClause += " p.createdOn >= DATE(NOW()) - INTERVAL 7 DAY";
      } else if (data.timePeriod == "monthly") {
        whereClause += " MONTH(p.createdOn) = MONTH(CURDATE())";
      } else if (data.timePeriod == "last3months") {
        whereClause += " p.createdOn >= DATE(NOW()) - INTERVAL 3 MONTH"
      } else if (data.timePeriod == "last6months") {
        whereClause += " p.createdOn >= DATE(NOW()) - INTERVAL 6 MONTH"
      } else if (data.timeperiod == "1year") {
        whereClause += "p.createdOn >= DATE(NOW()) - INTERVAL 12 MONTH "
      }
    }
    if (data && data.month) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " MONTH(p.createdOn) = :month";
    }
    if (data && data.from && data.to) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " p.createdOn BETWEEN :from AND :to "
    }
    if (data && data.status) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " p.status = :status";
    }
    if (data && data.clientName) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " p.clientName = :clientName";
    }
    if (data && data.domain) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " p.domain = :domain";
    }
    if (whereClause.length) {
      whereClause = " WHERE" + whereClause;
    }
    var query = `SELECT (
        SELECT COUNT(*) as count5 FROM tblproposalsubmission p
        INNER JOIN tblusers u ON u.id = p.userId ${whereClause}
      ) as totalRecords
    , p.*,MONTH(p.createdOn) as month,u.firstName,u.lastName,u.skills,u.dob,u.gender,u.email FROM tblproposalsubmission p `;
    query += `INNER JOIN tblusers u ON u.id = p.userId`;
    query += ` ${whereClause}`;
    return utility.query(query, data);
  },

  getportalCount: function (data) {
    var query = `SELECT  portal, count(*) as c `;
    if (data && data.userId) {
      query += `,id from tblproposalsubmission WHERE userId=${data.userId}`
      query += ` group by portal`;
    }
    else {
      query += ` from tblproposalsubmission group by portal`;
    }

    return utility.query(query, data);
  },
  getweekelyProposals: function (data) {
    var query =
      "SELECT p.*,u.firstName,u.lastName,u.skills,u.dob FROM tblproposalsubmission p";
    query += " INNER JOIN tblusers u ON u.id = p.userId";
    if (data && data.id) {
      query +=
        " WHERE p.userId = :id && p.createdOn BETWEEN (NOW() - INTERVAL 7 DAY) AND NOW()&& p.portal = :portal";
    }
    return utility.query(query, data);
  },
  getmonthlyProposals: function (data) {
    var query =
      "SELECT p.*,u.firstName,u.lastName,u.skills,u.dob,u.email,u.gender FROM tblproposalsubmission p";
    query += " INNER JOIN tblusers u ON u.id = p.userId ";
    if (data && data.id) {
      query +=
        " WHERE p.userId = :id && MONTH(p.createdOn) = MONTH(CURDATE()) && p.portal = :portal";
    }
    return utility.query(query, data);
  },
  gettodayProposals: function (data) {
    var query =
      "SELECT p.*,u.firstName,u.lastName,u.skills,u.dob FROM tblproposalsubmission p";
    query += " INNER JOIN tblusers u ON u.id = p.userId ";
    if (data && data.id) {
      query +=
        " WHERE p.userId = :id && DATE(p.createdOn) = CURDATE() && p.portal = :portal";
    }
    return utility.query(query, data);
  },
  editProposalFields: function (data) {

    var query = "UPDATE tblproposalsubmission SET";

    if (data && data.profile) {
      query += " profile = :profile,";
    }
    if (data && data.date) {
      query += " date = :date,";
    }
    if (data && data.portal) {
      query += " portal = :portal,";
    }
    if (data && data.clientName) {
      query += " clientName = :clientName,";
    }
    if (data && data.budget) {
      query += " budget = :budget,";
    }
    if (data && data.countryCityState) {
      query += " countryCityState = :countryCityState,";
    }
    if (data && data.company) {
      query += " company = :company,";
    }
    if (data && data.email) {
      query += " email = :email,";
    }
    if (data && data.emailP) {
      query += " emailP = :emailP,";
    }
    if (data && data.proposalTime) {
      query += " proposalTime = :proposalTime,";
    }
    if (data && data.companyEmail) {
      query += " companyEmail = :companyEmail,";
    }
    if (data && data.patternEmail) {
      query += " patternEmail = :patternEmail,";
    }
    if (data && data.clientDesignation) {
      query += " clientDesignation = :clientDesignation,";
    }
    if (data && data.jobRequirement) {
      query += " jobRequirement = :jobRequirement,";
    }
    if (data && data.phone) {
      query += " phone = :phone,";
    }
    if (data && data.phoneP) {
      query += " phoneP = :phoneP,";
    }
    if (data && data.domain) {
      query += " domain = :domain,";
    }
    if (data && data.linkedInProfile) {
      query += " linkedInProfile = :linkedInProfile,";
    }
    if (data && data.submissionTitle) {
      query += " submissionTitle = :submissionTitle,";
    }
    if (data && data.pitchContent) {
      query += " pitchContent = :pitchContent,";
    }
    if (data && data.email) {
      query += " email = :email,";
    }
    if (data && data.jobReqLink) {
      query += " jobReqLink = :jobReqLink,";
    }
    if (data && data.proposalLink) {
      query += " proposalLink = :proposalLink,";
    }
    if (data && data.clientPostedDateTime) {
      query += " clientPostedDateTime = :clientPostedDateTime,";
    }
    if (data && data.projectType) {
      query += " projectType = :projectType,";
    }
    if (data && data.proposalSubmissionDateTime) {
      query += " proposalSubmissionDateTime = :proposalSubmissionDateTime,";
    }
    if (data && data.status) {
      query += " status = :status,";
    }
    if (data && data.upworkId) {
      query += " upworkId = :upworkId,";
    }
    if (data && data.leadStatus) {
      query += " leadStatus = :leadStatus,";
    }
    if (data && data.companyUrl) {
      query += " companyUrl = :companyUrl,";
    }
    if (data && data.companyPhone) {
      query += " companyPhone = :companyPhone,";
    }
    if (data && data.companylinkedInProfile) {
      query += " companylinkedInProfile = :companylinkedInProfile,";
    }
    if (data && data.followUpDate) {
      query += " followUpDate = :followUpDate,";
    }
    if (data && data.followUpTime) {
      query += " followUpTime = :followUpTime,";
    }
    if (data && data.comment) {
      query += " comment= :comment,";
    }
    if (data && data.rating) {
      query += " rating = :rating,";
    }
    if (data && "isActive" in data) {
      query += " isActive = :isActive";
    }
    if (data && data.id) {
      query += " WHERE id=:id";
    }
    return utility.query(query, data);
  },
  deleteProposalFields: function (data) {
    var query =
      "DELETE FROM tblproposalsubmission WHERE id = :id";
    return utility.query(query, data);
  },
  csvFileUpload: function (file) {
    var query =
      "LOAD DATA INFILE '/var/lib/mysql-files/proposal.csv' INTO TABLE tblproposalsubmission FIELDS TERMINATED BY ',' IGNORE 1 LINES";
    return utility.query(query, file);
  },
  addrexproposal: function (data) {
    var query =
      "INSERT INTO tblproposalsubmission(guid,clientName,email,phone,jobRequirement,callSource,isActive,createdOn) VALUES (:guid,:clientName,:email,:phone,:jobRequirement,:callSource,:isActive,now())";
    return utility.query(query, data);
  },
};
