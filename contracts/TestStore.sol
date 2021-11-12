pragma solidity ^0.8.7;
import './Ownable.sol';
import './Item.sol';

contract TestStore is Ownable {
    uint index;
    enum PaymentStatus{ Purchased, InTransit, Delivered }

    struct S_Payment {
        address _item;
        address _buyer;
        uint _value;
        uint _quantity;
        uint _timePurchased;
        TestStore.PaymentStatus _status;
    }

    struct S_Item {
        string _identifier;
        address _owner;
        uint _price;
        uint _quantity;
        uint _timeCreated;
        uint _purchases;
        Item _item;
        mapping(uint => S_Payment) _payments;
    }

    mapping(uint => S_Item) public items;

    function createItem(string memory _name, uint _price, uint _quantity) public {
        Item item = new Item(_name, _price, owner, msg.sender, block.timestamp, index, _quantity, address(this));

        items[index]._identifier = _name;
        items[index]._owner = msg.sender;
        items[index]._price = _price;
        items[index]._quantity = _quantity;
        items[index]._timeCreated = block.timestamp;
        items[index]._item = item;

        index++;
    }

    function triggerPayment(uint _itemIndex, uint _quantity) public payable {
        require(msg.sender == address(items[_itemIndex]._item), "Function not called from Item Contract.");
        uint purchaseIndex = items[_itemIndex]._purchases;

        items[_itemIndex]._payments[purchaseIndex]._item = address(items[_itemIndex]._item);
        items[_itemIndex]._payments[purchaseIndex]._buyer = msg.sender;
        items[_itemIndex]._payments[purchaseIndex]._value = msg.value;
        items[_itemIndex]._payments[purchaseIndex]._quantity = _quantity;
        items[_itemIndex]._payments[purchaseIndex]._timePurchased = block.timestamp;
        items[_itemIndex]._payments[purchaseIndex]._status = PaymentStatus.Purchased;

        items[_itemIndex]._purchases++;
        items[_itemIndex]._quantity -= _quantity;
    }

    function editItem(uint _index, address _owner, uint _price, uint _quantity) public {
        require(msg.sender == address(items[_index]._item), "Funciton not called from Item Contract.");
        items[_index]._owner = _owner;
        items[_index]._price = _price;
        items[_index]._quantity = _quantity;
    } 
}