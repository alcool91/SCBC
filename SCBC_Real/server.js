const express    = require("express");
const bodyParser = require("body-parser");
const web3       = require("web3");

const app        = express();

const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));

require("./app/routes")(app, {});
app.listen(port, () => {
  console.log("Listening on port " + port);
})
