var Q = require('q');
var logStack = true;
var _ = require('underscore');
module.exports = {
	log : function(msg) {
		console.log(msg);
	},
	handleError : function(err, type){
		console.log("Catched Error:");
		console.log(err);
		if(err.message == "abort"){
			console.log("Aborting Q Promise chain");
			return;
		}

		if(logStack && err.stack){
			console.log(err.stack);
			// addErrorLog or send email to admin
		}
	}
}