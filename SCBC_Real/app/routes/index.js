const scbcRoutes = require("./scbc_routes.js");

module.exports = function(app, db) {
  scbcRoutes(app, db);
}
