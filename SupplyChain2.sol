pragma solidity ^0.4.17;

contract SupplyChain {

    struct SupplyChainNode {
        address addr;
        uint    nodeId;
        Item[]  inventory;
    }
    struct Item {
        string  itemType;
        uint    itemId;
        uint[2] puf; //One integer to hold the PUF value with the decimal point removed
                     //a second to hold the index of the decimal point
    }

    mapping (address => SupplyChainNode) nodeOf;

    SupplyChainNode[] public chain;
    address                  admin;

    modifier onlyAdmin()
    { require(msg.sender == admin);
      _;
    }

    modifier onlyOrigin()
    { require(nodeOf[msg.sender].nodeId == 0);
      _;
    }

    function SupplyChain() public payable {
        admin = msg.sender;
    }

    function register(address a, uint id) public payable onlyAdmin {
        chain.length++;
        chain[chain.length-1].addr      = a;
        chain[chain.length-1].nodeId    = id;
        nodeOf[a] = chain[chain.length-1];
    }

    function createItem(string i, uint id, uint[2] p) public payable onlyOrigin {
        nodeOf[msg.sender].inventory.length++;
        nodeOf[msg.sender].inventory[nodeOf[msg.sender].inventory.length-1].itemType = i;
        nodeOf[msg.sender].inventory[nodeOf[msg.sender].inventory.length-1].itemId   = id;
        nodeOf[msg.sender].inventory[nodeOf[msg.sender].inventory.length-1].puf      = p;

    }
}
