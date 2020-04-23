const fs = require("fs");
const path = require("path");
const Web3 = require("web3");

//TO DO : Wrap this loading of data from the contract into an async function
//so that I can use await and not have promises returned. Then take metadata as
//req, mint the token, get the ID, and write the metadata to the appropriate file.


var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
let item_abi_file = path.join(__dirname, "../../build/contracts/Item.json");
let item_abi_data = JSON.parse(fs.readFileSync(item_abi_file));
let item_abi = item_abi_data.abi;
const networkID = /*await*/ web3.eth.net.getId();
const item_address = item_abi_data.networks[networkID].address;
console.log(item_address); console.log(networkID);
let itemInstance = new web3.eth.Contract(item_abi, item_address);
module.exports = function(app, db) {
    app.post("/createitem", (req,res) => {
      //req.body = token parameters, one of which should be a unique ID.
      //create a json file file with token's metadata
      //web3.eth.getAccounts().then(console.log);
      let id = req.body.id.toString();
      let data = JSON.stringify(req.body);
      fs.writeFile(path.join(__dirname, "../../token_metadata/token" + id +".json"), data, (err) => {
        if (err) throw err;
      });
      res.send("hello");
    })
}
