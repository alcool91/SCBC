const express    = require("express");
const bodyParser = require("body-parser");
const Web3       = require("web3");

const app        = express();

const port = 8000;

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
//Test stuff Here


//web3.eth.getAccounts().then(console.log);
app.use(bodyParser.urlencoded({ extended: true }));

require("./app/routes")(app, {});
app.listen(port, () => {
  console.log("Listening on port " + port);
})
