pragma solidity ^0.8.7;
import './TestStore.sol';

contract Item {
    uint index;
    uint price;
    string name;
    uint quantity;
    address owner;
    address parent;
    uint timeCreated;
    address itemOwner;

    constructor(string memory _name, uint _price, address _owner, address _itemOwner, uint _timeCreated, uint _index, uint _quantity, address _parent) {
        name = _name;
        price = _price;
        owner = _owner;
        index = _index;
        parent = _parent;
        quantity = _quantity;
        itemOwner = _itemOwner;
        timeCreated = _timeCreated;
    }

    function pay(uint _quantity) public payable {
        require(_quantity >= 1, "Need 1 or more to purchase.");
        require(_quantity <= quantity, "Not enough in stock.");
        require(msg.value == price * _quantity, "Must pay specified price.");

        uint comission = msg.value * 5 / 100;
        uint itemOwnerPay = msg.value - comission;

        (bool itemOwnerSuccess, ) = itemOwner.call{ value: itemOwnerPay }('');
        require(itemOwnerSuccess, "Payment to Item Owner did not succeed. Please try again.");
        (bool ownerSuccess, ) = owner.call{ value: comission }('');
        require(ownerSuccess, "Payment to Owner did not succeed. Please try again.");

        (bool parentSuccess, ) = parent.call{ value: 0 }(abi.encodeWithSignature('triggerPayment(uint256,uint256)', index, _quantity));
    }

    function editItem(uint _index, address _owner, uint _price, uint _quantity) external {
        require(msg.sender == itemOwner, "You do not have access to edit this item.");

        (bool success, ) = parent.call{ value: 0 }(abi.encodeWithSignature('editItem(uint256,address,uint256,uint256)', _index, _owner, _price, _quantity));

        require(success, "Call was not successful. Please try again.");

        itemOwner = _owner;
        price = _price;
        quantity = _quantity;
    }

    function returnItemOwner() external view returns(address) {
        return itemOwner;
    }

    fallback() external {}
}