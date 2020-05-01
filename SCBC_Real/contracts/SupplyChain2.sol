pragma solidity >=0.4.17 <0.7.0;
pragma experimental ABIEncoderV2;

import "../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721Full.sol";

contract Item is ERC721Full {
  string[]  public ids;

  constructor() ERC721Full('Item', 'ITEM') public {}

  function mint(string memory _item, string memory _uri) public returns (uint){
    //
    uint _id = ids.push(_item);
    _mint(msg.sender, _id);
    _setTokenURI(_id, _uri);
    return _id;
  }
}

contract SupplyChain2 {

    struct SupplyChainNode {
        address addr;
        uint    nodeId;
        //These inventories will hold the IDs of the tokens in them
        uint[] inventory;
        uint[] received;
        uint[] flagged;

    }
    // struct Item {
    //     string  itemType;
    //     uint    itemId;
    //     uint[2] puf; //One integer to hold the PUF value with the decimal point removed
    //                  //a second to hold the index of the decimal point
    // }

    mapping (address => SupplyChainNode) nodeOf;


    address admin;
    uint constant CHAINSIZE = 5;
    SupplyChainNode[CHAINSIZE] public chain;

    modifier onlyAdmin()
    { require(msg.sender == admin);
      _;
    }

    modifier onlyOrigin()
    { require(nodeOf[msg.sender].nodeId == 0);
      _;
    }

    function isSelfOrAdmin(address a) public returns (bool) {
        if (msg.sender == a) { return true; }
        else if (msg.sender == admin) { return true; }
        return false;
    }
    function getChain() public returns (address[] memory) {
      address[] memory toReturn = new address[](CHAINSIZE);
      for(uint i = 0; i < CHAINSIZE; i++){
        toReturn[i] = chain[i].addr;
      }
      return toReturn;
    }

    modifier onlyThis(address a)
    { require(isSelfOrAdmin(a));
      _;
    }

    constructor() public payable {
        admin = msg.sender;
    }

    function register(address a, uint loc) public payable onlyAdmin {
        //chain.length++;
        //chain[chain.length-1].addr      = a;
        //chain[chain.length-1].nodeId    = id;
        chain[loc].addr      = a;
        chain[loc].nodeId    = loc;
        nodeOf[a] = chain[loc];
    }

    // function createItem(string memory i, uint id, uint[2] memory p) public payable {
    //     nodeOf[msg.sender].inventory.length++;
    //     nodeOf[msg.sender].inventory[nodeOf[msg.sender].inventory.length-1].itemType = i;
    //     nodeOf[msg.sender].inventory[nodeOf[msg.sender].inventory.length-1].itemId   = id;
    //     nodeOf[msg.sender].inventory[nodeOf[msg.sender].inventory.length-1].puf      = p;
    //
    // }
    function flagItem(address a, uint _id) public {
      for(uint i = 0; i < nodeOf[a].received.length; i++) {
        if(nodeOf[a].received[i] == _id) {
          nodeOf[a].flagged.length++;
          nodeOf[a].flagged[nodeOf[a].flagged.length-1] = _id;
          nodeOf[a].received[i] = nodeOf[a].received[nodeOf[a].received.length-1];
          delete nodeOf[a].received[nodeOf[a].received.length-1];
        }
      }
      for(uint i = 0; i < nodeOf[a].inventory.length; i++) {
        if(nodeOf[a].inventory[i] == _id) {
          nodeOf[a].flagged.length++;
          nodeOf[a].flagged[nodeOf[a].flagged.length-1] = _id;
          nodeOf[a].inventory[i] = nodeOf[a].inventory[nodeOf[a].inventory.length-1];
          delete nodeOf[a].inventory[nodeOf[a].inventory.length-1];
        }
      }
    }
    function confirmItem(address a, uint _id) public {
      for(uint i = 0; i < nodeOf[a].received.length; i++) {
        if(nodeOf[a].received[i] == _id) {
          nodeOf[a].inventory.length++;
          nodeOf[a].inventory[nodeOf[a].inventory.length-1] = _id;
          nodeOf[a].received[i] = nodeOf[a].received[nodeOf[a].received.length-1];
          delete nodeOf[a].received[nodeOf[a].received.length-1];
        }
      }
    }
    function getInventory(address s) public onlyThis(s) returns (uint[] memory) {
        uint[] memory toReturn = new uint[](nodeOf[s].inventory.length);
        for(uint i = 0; i < nodeOf[s].inventory.length; i++){
          toReturn[i] = nodeOf[s].inventory[i];
        }
        return toReturn;
    }
    function getReceived(address s) public onlyThis(s) returns (uint[] memory) {
        uint[] memory toReturn = new uint[](nodeOf[s].received.length);
        for(uint i = 0; i < nodeOf[s].received.length; i++){
          toReturn[i] = nodeOf[s].received[i];
        }
        return toReturn;
    }
    function getFlagged(address s) public onlyThis(s) returns (uint[] memory) {
        uint[] memory toReturn = new uint[](nodeOf[s].flagged.length);
        for(uint i = 0; i < nodeOf[s].flagged.length; i++){
          toReturn[i] = nodeOf[s].flagged[i];
        }
        return toReturn;
    }

    function addItem(uint256 a) public payable {
        nodeOf[msg.sender].inventory.length++;
        nodeOf[msg.sender].inventory[nodeOf[msg.sender].inventory.length-1] = a;
    }

    // function removeItem(Item memory a) public payable {
    //     for(uint i = 0; i < nodeOf[msg.sender].inventory.length; i++) {
    //         if(nodeOf[msg.sender].inventory[i].itemId == a.itemId) {
    //             for(uint j = i+1; j < nodeOf[msg.sender].inventory.length; j++) {
    //                 nodeOf[msg.sender].inventory[j-1]=nodeOf[msg.sender].inventory[j];
    //             }
    //             nodeOf[msg.sender].inventory.length--;
    //         }
    //     }
    // }

    function passItem(address s, address t, uint id) public onlyThis(s) payable {
        for(uint i = 0; i < nodeOf[s].inventory.length; i++) {
            if(nodeOf[s].inventory[i] == id) {
              nodeOf[t].received.length++;
              nodeOf[t].received[nodeOf[t].received.length-1] = id;
              nodeOf[s].inventory[i] = nodeOf[s].inventory[nodeOf[s].inventory.length-1];
              delete nodeOf[s].inventory[nodeOf[s].inventory.length-1];
              nodeOf[s].inventory.length--;
            }
        }
    }

}
