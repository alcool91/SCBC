let SCBC = artifacts.require("./SupplyChain2.sol");

let SCBCinstance;

contract('SCBCContract', function(accounts) {
  it('contract deployment', function() {
    return SCBC.deployed().then(function(instance){
      SCBCinstance = instance;
      assert(SCBCinstance != undefined, 'Contract should be deployed');
    });
  });
  //put more test cases here
});
