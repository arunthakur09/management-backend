var Handlebars = require("express-handlebars");

//helper.js
module.export = function() {
  // Your logic here
  Handlebars.registerHelper("ifEquals", function(arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });
};
