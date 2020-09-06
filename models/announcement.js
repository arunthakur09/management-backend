var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");

module.exports = {
  addannouncements: function(data) {
    var query =
      "INSERT INTO tblannouncement(title, subtitle, location, expiryDate, notifyAllEmployees,notifyAnyOthers, isActive, createdOn) VALUES(:title, :subtitle, :location, :expiryDate, :notifyAllEmployees,:notifyAnyOthers, :isActive, now())";
    return utility.query(query, data);
  },
  getannouncements: function(data) {
    var query =
      "SELECT title, subtitle, location, expiryDate,notifyAllEmployees,notifyAnyOthers,(Case When isActive=1 Then 1 Else 0 End) AS isActive FROM tblannouncement";
    if (data && data.id) {
      query += " WHERE id = :id";
    }
    return utility.query(query, data);
  },

  editannouncements: function(data) {
    var query = "UPDATE tblannouncement SET";
    if (data && data.title) {
      query += " title = :title,";
    }
    if (data && data.subtitle) {
      query += " subtitle = :subtitle,";
    }
    if (data && data.location) {
      query += " location = :location,";
    }
    if (data && data.expiryDate) {
      query += " expiryDate = :expiryDate,";
    }
    if (data && data.notifyAllEmployees) {
      query += " notifyAllEmployees = :notifyAllEmployees,";
    }
    if (data && data.notifyAnyOthers) {
      query += " notifyAnyOthers = :notifyAnyOthers,";
    }

    if (data && "isActive" in data) {
      query += " isActive = :isActive";
    }

    if (data && data.id) {
      query += " WHERE id=:id";
    }
    return utility.query(query, data);
  },

  deleteannouncements: function(data) {
    var query = "UPDATE tblannouncement SET isActive = 0 WHERE id = :id";
    return utility.query(query, data);
  }
};
