var RoleModel = require("./role.js");
var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");
var logger = require("./logger.js");

module.exports = {
  registerUser: function (data) {
    var query =
      "INSERT INTO tblusers(guid,firstName,lastName,maritalStatus,nationality,streetAddress,city,state,postalCode,country,phoneP,phoneW,emailP,jobTitle,joiningDate,employeeStatus,supervisor,subordinate,workExperience,education,userKra,dob,skills,gender,email,password,isDepartmentHead,isActive,createdOn)";
    query +=
      "VALUES(:guid,:firstName,:lastName,:maritalStatus,:nationality,:streetAddress,:city,:state,:postalCode,:country,:phoneP,:phoneW,:emailP,:jobTitle,:joiningDate,:employeeStatus,:supervisor,:subordinate,:workExperience,:education,:userKra,:dob,:skills,:gender,:email,:password,:isDepartmentHead,:isActive,now());";
    return utility.query(query, data);
  },
  //Add roles to user
  addRoles: function (userId, roles) {
    var deffered = Q.defer();
    var query = "delete from tbluserrole where userId=:userId";
    utility
      .query(query, { userId: userId })
      .then(
        function (result) {
          if (roles.length > 0) {
            module.exports.insertRoles(userId, roles).then(
              function (r) {
                deffered.resolve(r);
              },
              function (err) {
                deffered.reject(err);
              }
            );
          } else {
            RoleModel.getRoles({ isDefault: true })
              .then(
                function (roles) {
                  console.log(roles, userId);
                  module.exports.insertRoles(userId, roles).then(
                    function (r) {
                      deffered.resolve(r);
                    },
                    function (err) {
                      deffered.reject(err);
                    }
                  );
                },
                function (err) {
                  deffered.reject(err);
                }
              )
              .fail(logger.handleError);
          }
        },
        function (err) {
          deffered.reject(err);
        }
      )
      .fail(logger.handleError);
    return deffered.promise;
  },
  insertRoles: function (userId, roles) {
    var inserted = [];
    var query =
      "Insert into tbluserrole(userId, roleId) Values(:userId, :roleId)";
    var p = [];
    _.each(roles, function (role) {
      var roleId = role.id ? role.id : role;
      console.log(userId, roleId);
      p.push(utility.query(query, { userId: userId, roleId: roleId }));
    });
    return Q.all(p);
  },
  addUserDepartment: function (data) {
    var query =
      "Insert into tbluserdepartment(userId, departmentId) Values(:userId, :departmentId)";
    return utility.query(query, data);
  },
  getUser: function (data) {
    var query = `SELECT users.id as userId, users.secondaryId,users.email, userPermission.permissionId
    FROM users
    INNER JOIN userPermission
    ON users.id = userPermission.userId`;
    //"SELECT id as userId,secondaryId,email,password,roleId,deptId,isActive,lastUpdated,createdOn FROM users";
    if (data && data.userId) {
      query += " AND users.id= :userId";
    }
    return utility.query(query, data);
  },
  getUsers: function (data) {
    var whereClause = "";
    if (data && data.id) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " u.id = :id";
    }
    if (data && data.userId) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " u.id = :userId";
    }
    if (data && data.email) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " u.email = :email";
    }
    if (data && data.isActive) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " u.isActive = :isActive";
    }
    if (data && data.firstName) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " u.firstName = :firstName";
    }

    if (data && data.guid) {
      if (whereClause.length) whereClause += " and ";
      whereClause += "  u.guid = :guid";
    }
    if (data && data.departmentName) {
      if (whereClause.length) whereClause += " and ";
      whereClause += "  d.departmentName = :departmentName";
    }
    if (data && data.firstName && data.lastName) {
      if (whereClause.length) whereClause += " and ";
      whereClause += "  u.firstName = :firstName AND u.lastName= :lastName";
    }
    if (data && data.employeeId) {
      if (whereClause.length) whereClause += " and ";
      whereClause += "  u.employeeId = :employeeId";
    }
    if (data && data.supervisor) {
      if (whereClause.length) whereClause += " and ";
      whereClause += "  u.supervisor = :supervisor";
    }
    if (data && data.jobTitle) {
      if (whereClause.length) whereClause += " and ";
      whereClause += "  u.jobTitle = :jobTitle";
    }
    if (data && data.timePeriod) {
      if (whereClause.length) whereClause += " and ";
      if (data.timePeriod == "today") {
        whereClause += " DATE(u.createdOn) = CURDATE()";
      } else if (data.timePeriod == "weekly") {
        whereClause += " u.createdOn >= DATE(NOW()) - INTERVAL 7 DAY";
      } else if (data.timePeriod == "monthly") {
        whereClause += " MONTH(u.createdOn) = MONTH(CURDATE())";
      } else if (data.timePeriod == "last3months") {
        whereClause += " u.createdOn >= DATE(NOW()) - INTERVAL 3 MONTH";
      } else if (data.timePeriod == "last6months") {
        whereClause += " u.createdOn >= DATE(NOW()) - INTERVAL 6 MONTH";
      } else if (data.timePeriod == "1year") {
        whereClause += " YEAR(u.createdOn) = YEAR(CURDATE())";
      }
    }
    if (data && data.from && data.to) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " u.createdOn BETWEEN :from AND :to "
    }
    if (data && data.employeeStatus) {
      if (whereClause.length) whereClause += " and ";
      whereClause += "  u.employeeStatus = :employeeStatus";
    }
    if (data && data.isDepartmentHead) {
      if (whereClause.length) whereClause += " and ";
      whereClause += "  u.isDepartmentHead = :isDepartmentHead";
    }
    if (data && data.month) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " MONTH(u.createdOn) = :month";
    }
    if (data && data.CurrentDate) {
      if (whereClause.length) whereClause += " and ";
      whereClause += " u.CurrentDate = :CurrentDate";
    }

    //var query1 = "SELECT u.,d.,td.* FROM tblusers u left join tbluserdepartment d on u.id = d.userId INNER JOIN tblDepartments td on d.departmentId = td.id where u.id =14"
    var query = `SELECT MONTH(u.createdOn) as month,u.isActive,u.ResignedDate,u.id,u.guid,u.isDepartmentHead,u.firstName,u.lastName,u.maritalStatus,u.nationality,u.streetAddress,u.city,u.state,u.postalCode,u.country,u.phoneP,u.phoneW,u.emailP,u.jobTitle,u.joiningDate,u.employeeStatus,u.supervisor,u.subordinate,u.workExperience,u.education,u.userKra,u.email,u.skills,u.dob,u.gender,u.currentDate,u.userImage,u.forgotToken,u.authToken,u.isResigned,u.createdOn, roleId, up.permissionId, ud.departmentId,d.departmentName FROM tblusers u `
    query += " INNER JOIN tbluserrole ur on ur.userId = u.id ";
    query += "LEFT JOIN tbluserpermission up ON u.id = up.userId ";
    query += "LEFT JOIN tbluserdepartment ud ON ud.userId = u.id ";
    query += `LEFT JOIN tbldepartments d ON d.id = ud.departmentId `
    if (whereClause.length) {
      query += `WHERE ${whereClause}`
    }
    query += ` ORDER BY u.id`
    return utility.query(query, data);
  },

  getSalesUser: function (data) {
    var query =
      "SELECT u.id, ur.roleId,ud.departmentId,count(ps.portal) as count, d.departmentName,u.guid,up.permissionId, u.firstName, u.lastName,u.userKra,u.skills,u.dob,u.gender, u.email, password, (Case When u.isActive=1 Then 1 Else 0 End) AS isActive FROM tblusers u";
    query += " INNER JOIN tbluserrole ur on ur.userId = u.id ";
    query += "LEFT JOIN tbluserpermission up ON u.id = up.userId ";
    query += "LEFT JOIN tbluserdepartment ud ON ud.userId = u.id ";
    query += "LEFT JOIN tbldepartments d ON d.id = ud.departmentId ";
    query += "INNER JOIN tblproposalsubmission ps ON ps.userId = u.id ";

    if (data && data.email) {
      query += " where u.email = :email";
    }
    if (data && data.id) {
      query += " where u.id = :id";
    }
    if (data && data.guid) {
      query += " where u.guid = :guid";
    }
    if (data && data.departmentName) {
      query += " where d.departmentName = :departmentName";
    }
    query += " group by ps.userId"
    return utility.query(query, data);
  },
  editUser: function (data) {
    var query = "UPDATE tblusers SET";
    if (data && data.email) {
      query += " email = :email";
    }
    if (data && data.firstName) {
      query += " ,firstName = :firstName";
    }
    if (data && "isActive" in data) {
      query += " ,isActive = :isActive";
    }
    if (data && data.lastName) {
      query += " ,lastName = :lastName";
    }
    if (data && data.CurrentDate) {
      query += " ,CurrentDate = :CurrentDate";
    }
    if (data && data.ResignedDate) {
      query += " ,ResignedDate = :ResignedDate";
    }
    if (data && data.isResigned) {
      query += " ,isResigned = :isResigned";
    }
    if (data && data.skills) {
      query += " ,skills = :skills";
    }
    if (data && data.userKra) {
      query += " ,userKra = :userKra";
    }
    if (data && data.dob) {
      query += " ,dob = :dob";
    }
    if (data && data.gender) {
      query += " ,gender = :gender";
    }
    if (data && data.streetAddress) {
      query += " ,streetAddress = :streetAddress";
    }
    if (data && data.maritalStatus) {
      query += " ,maritalStatus = :maritalStatus";
    }
    if (data && data.nationality) {
      query += " ,nationality = :nationality";
    }
    if (data && data.city) {
      query += " ,city = :city";
    }
    if (data && data.state) {
      query += " ,state = :state";
    }
    if (data && data.postalCode) {
      query += " ,postalCode = :postalCode";
    }
    if (data && data.country) {
      query += " ,country = :country";
    }
    if (data && data.phoneP) {
      query += " ,phoneP = :phoneP";
    }
    if (data && data.phoneW) {
      query += " ,phoneW = :phoneW";
    }
    if (data && data.emailP) {
      query += " ,emailP = :emailP";
    }
    if (data && data.jobTitle) {
      query += " ,jobTitle = :jobTitle";
    }
    if (data && data.joiningDate) {
      query += " ,joiningDate = :joiningDate";
    }
    if (data && data.employeeStatus) {
      query += " ,employeeStatus = :employeeStatus";
    }
    if (data && data.supervisor) {
      query += " ,supervisor = :supervisor";
    }
    if (data && data.subotrdinate) {
      query += " ,subotrdinate = :subotrdinate";
    }
    if (data && data.workExperience) {
      query += " ,workExperience = :workExperience";
    }
    if (data && data.education) {
      query += " ,education = :education";
    }
    if (data && data.userImage) {
      query += " userImage = :userImage";
    }

    query += " WHERE id=:id";
    return utility.query(query, data);
  },
  getadmin: async function (data) {
    var query = `SELECT u.id,CONCAT(u.firstName, ' ', u.lastName) as firstName, td.departmentname FROM tblusers u
  INNER JOIN tbluserdepartment d on d.userId= u.id
  INNER JOIN tbldepartments td on td.id = d.departmentId
  WHERE td.departmentname IN ('System Admin', 'SALES')`
    return utility.query(query, data)
  },

  editUserPermissions: async function (data) {
    var query = "SELECT * from tbluserpermission WHERE userId= :id";
    const hasPermission = await utility.query(query, data);
    // if hasPermission is empty
    if (hasPermission.length <= 0) {
      // insert query
      // return result
      query =
        "INSERT INTO tbluserpermission(userId,permissionId) VALUES(:id,:permissionId)";
      return utility.query(query, data);
    } else {
      // else update query
      // return result
      query =
        "UPDATE tbluserpermission SET permissionId=:permissionId WHERE userId=:id";
      return utility.query(query, data);
    }
  },
  editUserDepartment: async function (data) {
    var query =
      "UPDATE tbluserdepartment SET departmentId=:departmentId WHERE userId=:userId";
    return utility.query(query, data);
  },

  deleteUser: function (data) {
    var query = "UPDATE tblusers SET isActive=0 WHERE id=:userId";
    return utility.query(query, data);
  },
  verifyUserPermissions: function (data) {
    var query =
      "SELECT requestType, requestUrl from tbluserpermission tup inner join tblpermissions tp on FIND_IN_SET(tp.id, REPLACE(tup.permissionId,'|',',')) > 0   where userId = :userId and requestType = :requestType and requestUrl = :requestUrl";
    return utility.query(query, data).then(function (result) {
      if (result.length) return true;
      else return false;
    });

    // no need already added in sql query
    // return utility.query(query, data).then(function(result) {
    //   if(result.length) {
    //     const permissionExists = result.filter(function(row){
    //       return row.requestType == data.requestType && row.requestUrl == data.requestUrl
    //     });
    //     if(permissionExists.length) return true;
    //   } else return false;
    // })
  },
  verifyUser: (data) => {
    var query = `SELECT u.id, ur.roleId, u.password, u.email, u.guid, u.isActive FROM tblusers u`
    query += ` INNER JOIN tbluserrole ur on ur.userId = u.id`
    query += ` WHERE u.email = :email`
    return utility.query(query, data);
  },
};
