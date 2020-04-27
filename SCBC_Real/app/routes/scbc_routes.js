const fs = require("fs");
const path = require("path");
const Web3 = require("web3");
const cors = require('cors')



//TO DO : Wrap this loading of data from the contract into an async function
//so that I can use await and not have promises returned. Then take metadata as
//req, mint the token, get the ID, and write the metadata to the appropriate file.

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
let item_abi_file, item_abi_data, item_abi, itemInstance, networkID;
let supply_chain_abi_file, supply_chain_abi_data, supply_chain_abi, supplyChainInstance;
var user_address;

async function loadItemContract() {
  item_abi_file = path.join(__dirname, "../../build/contracts/Item.json");
  item_abi_data = JSON.parse(fs.readFileSync(item_abi_file));
  item_abi = item_abi_data.abi;
  networkID = await web3.eth.net.getId();
  const item_address = item_abi_data.networks[networkID].address;
  //console.log(item_address); console.log(networkID);
  itemInstance = new web3.eth.Contract(item_abi, item_address);
  //const accounts = await web3.eth.getAccounts();
  //user_address = accounts[0];
  //itemInstance.methods.ownerOf(1).call().then(console.log);
  //itemInstance.methods.balanceOf('0xa92A5E007332Aac5D0CEe2e7090580fD1a9B7e8e').call().then(console.log);
  //console.log(user_address);
}
async function loadSupplyChainContract() {
  supply_chain_abi_file = path.join(__dirname, "../../build/contracts/SupplyChain2.json");
  supply_chain_abi_data = JSON.parse(fs.readFileSync(supply_chain_abi_file));
  supply_chain_abi = supply_chain_abi_data.abi;
  networkID = await web3.eth.net.getId();
  const supply_chain_address = supply_chain_abi_data.networks[networkID].address;
  supplyChainInstance = new web3.eth.Contract(supply_chain_abi, supply_chain_address);

}


module.exports = function(app, db) {
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
    //app.use(cors());
    app.post("/createitem", async (req,res) => {
      console.log("CREATE ITEM CALLED!!!!!!!!!!!")
      //req.body = token parameters, including name (serial #?)
      //create a json file file with token's metadata
      //web3.eth.getAccounts().then(console.log);
      if ((req.body.name == undefined) || (req.body.description == undefined) || (req.body.image == undefined)) { res.send("Please include name, description and image in request (these can be empty strings)"); }
      else {
        let id = await itemInstance.methods.totalSupply().call();//req.body.id.toString();
        id = (parseInt(id) + 1).toString();
        console.log("ID " + id);
        let name = req.body.name;
        let uri_path = path.join(__dirname, "../../token_metadata/token" + id +".json");
        console.log(req.body);
        let data = JSON.stringify(req.body);
        console.log(data);
        let _id = itemInstance.methods.mint(name, uri_path).send({ from: user_address, gas: 2000000 });
        console.log("_id " + _id );
        fs.writeFile(uri_path, data, (err) => {
          if (err) throw err;
        });
        supplyChainInstance.methods.addItem(id).send({from: user_address});
        res.send("Item Token Created Successfully!");
      }
    })
    app.post("/getitemmetadata", async (req,res) => {
      if (req.body.id == undefined) { res.send("Please include an ID in metadata requests"); }
      else {
        let _id  = parseInt(req.body.id);
        let _URI = await itemInstance.methods.tokenURI(_id).call();
        let raw_metadata = fs.readFileSync(_URI);
        res.send(raw_metadata);
      }
    })
    app.post("/verifyuser", async (req, res) => {
      let data_array = fs.readFileSync(path.join(__dirname, "../../user_data/users.txt"), 'utf8').split('\n');
      let result = {}
      for (i = 0; i < data_array.length; i++) {
        data_array[i] = data_array[i].split(',');
        if(data_array[i][0] == req.body.user) {
          //user found in users.txt file
          if(data_array[i][1] == req.body.password) {
            //user and password successfully matched
            result.verified = true;
            result.user = req.body.user;
            result.account = data_array[i][2];
            result.private_key = data_array[i][3];
            user_address = data_array[i][2];
            loadItemContract();
            loadSupplyChainContract();
          }
          else {
            result.verified = false;
          }
        }
      }
      console.log(req.body)
      console.log(result)
      //console.log(data);
      res.send(JSON.stringify(result));
    })
    app.post("/newuser", async (req, res) => {
      let raw_data = req.body;
      console.log(typeof raw_data);
      //let data = JSON.parse(raw_data);
      let data = raw_data;
      console.log(data);
      let user_data = fs.readFileSync(path.join(__dirname, "../../user_data/users.txt"), 'utf8').split('\n');
      console.log(user_data);
      user_data.pop();
      user_data.push(`${data.user},${data.password},${data.address},${data.private_key}`);
      user_data.push("");
      let file_data = user_data.join('\n');
      fs.writeFile(path.join(__dirname, '../../user_data/users.txt'), file_data, (err) => {
        if (err) throw err;
      });
      console.log(user_data);
      res.send("User Added Successfully!");

    })
}
