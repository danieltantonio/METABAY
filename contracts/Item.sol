pragma solidity ^0.8.7;
import './Store.sol';

contract Item {
    uint index;
    uint price;
    string name;
    address parent;
    uint timeCreated;
    address itemOwner;

    constructor(string memory _name, uint _price, address _itemOwner, uint _timeCreated, uint _index, address _parent) {
        name = _name;
        price = _price;
        index = _index;
        parent = _parent;
        itemOwner = _itemOwner;
        timeCreated = _timeCreated;
    }

    function pay(uint _quantity) public payable {
        (bool parentSuccess, ) = parent.call{ value: 0 }(abi.encodeWithSignature('triggerPayment(uint256,uint256)', index, _quantity));
    }

    function editItem(uint _index, address _owner, uint _price, uint _quantity) external {
        require(msg.sender == itemOwner, "You do not have access to edit this item.");
        (bool success, ) = parent.call{ value: 0 }(abi.encodeWithSignature('editItem(uint256,address,uint256,uint256)', _index, _owner, _price, _quantity));

        require(success, "Call was not successful. Please try again.");

        itemOwner = _owner;
        price = _price;
    }

    function returnItemOwner() external view returns(address) {
        return itemOwner;
    }

    fallback() external {}
}