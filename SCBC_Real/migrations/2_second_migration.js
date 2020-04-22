let Item = artifacts.require("Item")
let Sc2  = artifacts.require("SupplyChain2")

module.exports = function(deployer) {
  deployer.deploy(Item);
  deployer.deploy(Sc2);
};
