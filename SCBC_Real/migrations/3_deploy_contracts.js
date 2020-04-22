var SCBC = artifacts.require("./SupplyChain2.sol");
module.exports = function(deployer) {
  deployer.deploy(SCBC, "hello");
  // Additional contracts can be deployed here
};
