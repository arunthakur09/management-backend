// Importing node modules
var Q = require("q");
var fs = require("fs");
var logger = require("../models/logger.js");

module.exports = {
  query: function (query, params, callback) {
    var deffered = Q.defer();

    pool.getConnection(function (err, conn) {
      if (err) {
        logger.handleError(err, "Connection");
        deffered.reject(err);
      } else {
        conn.config.queryFormat = function (query, values) {
          if (!values) {
            return query;
          }
          return query.replace(
            /\:(\w+)/g,
            function (txt, key) {
              if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
              }
              return txt;
            }.bind(this)
          );
        };
        var compiled = conn.query(query, params, function (err, result) {
          conn.release();
          if (err) {
            err.stack += " Query:" + compiled.sql;
            logger.handleError(err, "SQL");
            deffered.reject(err);
            console.log("Error in Query" + err);
          } else deffered.resolve(result);
        });

        console.log(compiled.sql);
      }
    });
    return deffered.promise;
  }
};
