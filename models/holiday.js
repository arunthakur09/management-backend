var utility = require("../scripts/utility.js");
module.exports = {
    addHoliday: function (data) {
        var query =
            "INSERT INTO tblHoliday(guid,name,day,fromDate,toDate,isActive,createdOn) VALUES(:guid,:name,:day,:fromDate,:toDate,:isActive,now())";
        return utility.query(query, data)
    },
    getHoliday: function (data) {
        var whereClause = "";
        if (data && data.id) {
            whereClause += " h.id = :id";
        }
        if (data && data.monthly) {
            whereClause += " MONTH(h.fromDate) = :monthly";
        }
        if (whereClause.length) {
            whereClause = " WHERE" + whereClause;
        }
        var query = `SELECT * FROM tblHoliday h ${whereClause} `;
        return utility.query(query, data);
    },
    editHoliday: function (data) {
        var query = "UPDATE tblHoliday SET";
        if (data && data.name) {
            query += " name = :name";
        }
        if (data && data.fromDate) {
            query += " ,fromDate= :fromDate";
        }
        if (data && data.toDate) {
            query += " ,toDate = :toDate";
        }
        if (data && data.isActive) {
            query += " ,isActive = :isActive";
        }
        if (data && data.id) {
            query += " WHERE id=:id";
        }
        return utility.query(query, data);
    },
    deleteHoliday: function (data) {
        var query = "DELETE FROM tblHoliday WHERE id = :id";
        return utility.query(query, data);
    }
};