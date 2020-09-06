var utility = require("../scripts/utility.js");
var Q = require("q");

module.exports = {
  getRoles: function(filters) {
    var query =
      "Select id,`name`,roleType,(Case When isDefault=1 Then 1 Else 0 End) AS isDefault from tblroles R where isActive=1 ";
    if (filters.isDefault) {
      query = query + " and isDefault=1";
    }
    return utility.query(query, filters);
  }
};
