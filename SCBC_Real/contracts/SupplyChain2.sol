pragma solidity ^0.4.21;
pragma experimental ABIEncoderV2;

contract SupplyChain2 {

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

    function isSelfOrAdmin(SupplyChainNode a) public returns (bool) {
        if (msg.sender == a.addr) { return true; }
        else if (msg.sender == admin) { return true; }
        return false;
    }

    modifier onlyThis(SupplyChainNode a)
    { require(isSelfOrAdmin(a));
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

    function getInventory(uint a, SupplyChainNode s) public onlyThis(s) returns (Item) {
        if (s.inventory.length <= a) { revert(); }
        return s.inventory[a];
    }

    function addItem(Item a, SupplyChainNode s) public payable {
        nodeOf[msg.sender].inventory.length++;
        nodeOf[msg.sender].inventory[nodeOf[msg.sender].inventory.length-1] = a;
    }

    function removeItem(Item a) public payable {
        for(uint i = 0; i < nodeOf[msg.sender].inventory.length; i++) {
            if(nodeOf[msg.sender].inventory[i].itemId == a.itemId) {
                for(uint j = i+1; j < nodeOf[msg.sender].inventory.length; j++) {
                    nodeOf[msg.sender].inventory[j-1]=nodeOf[msg.sender].inventory[j];
                }
                nodeOf[msg.sender].inventory.length--;
            }
        }
    }

    function passItem(uint Iid, SupplyChainNode s) public onlyThis(s) payable {
        for(uint i = 0; i < s.inventory.length; i++) {
            if(s.inventory[i].itemId == Iid) {
                addItem(s.inventory[i], chain[(s.nodeId)+1]);
                removeItem(s.inventory[i]);
            }
        }
    }

}
