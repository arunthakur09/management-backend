var utility = require("../scripts/utility.js");
var Q = require("q");
var _ = require("underscore");

module.exports = {
  addtrainingSyllabus: function(data) {
    var query =
      "INSERT INTO tbltrainingSyllabus( type, syllabus, isActive, createdOn) VALUES(:type, :syllabus, :isActive, now())";
    return utility.query(query, data);
  },
  getTrainingSyllabus: function(data) {
    var query =
      "SELECT id, type, syllabus, (Case When isActive=1 Then 1 Else 0 End) AS isActive FROM tbltrainingSyllabus";
    if (data && data.id) {
      query += " WHERE id = :id";
    }
    return utility.query(query, data);
  },
  editTrainingSyllabus: function(data) {
    var query = "UPDATE tbltrainingSyllabus SET";
    if (data && data.type) {
      query += " type = :type,";
    }

    if (data && data.syllabus) {
      query += " syllabus = :syllabus,";
    }

    if (data && "isActive" in data) {
      query += " isActive = :isActive";
    }

    if (data && data.id) {
      query += " WHERE id=:id";
    }
    return utility.query(query, data);
  },
  deleteTrainingSyllabus: function(data) {
    var query = "UPDATE tbltrainingSyllabus SET isActive = 0 WHERE id = :id";
    return utility.query(query, data);
  },
  addSyllabusResponse: function(data) {
    var query =
      "INSERT INTO tblUserTrainingCompletion ( userId, syllabusId, isActive, createdOn) VALUES(:userId, :syllabusId, :isActive, now())";
    return utility.query(query, data);
  },
  getSyllabusResponse: function(data) {
    var query =
      "SELECT id,userId, syllabusId, (Case When isActive=1 Then 1 Else 0 End) AS isActive FROM tblUserTrainingCompletion";
    if (data && data.id) {
      query += " WHERE id = :id";
    }
    return utility.query(query, data);
  }
};
