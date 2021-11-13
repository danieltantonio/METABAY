pragma solidity ^0.8.7;
import './Ownable.sol';
import './Item.sol';

contract Store is Ownable {
    uint index;
    enum SupplyStatus{ Purchased, InTransit, Delivered }

    event ItemEvent(uint _itemIndex, address _itemAddress);
    event PaymentEvent(uint _status);

    struct S_Payment {
        address _item;
        address _buyer;
        uint _value;
        uint _quantity;
        uint _timePurchased;
        Store.SupplyStatus _status;
    }

    struct S_Item {
        string _identifier;
        address _itemOwner;
        uint _price;
        uint _quantity;
        uint _timeCreated;
        uint _purchases;
        Item _item;
        mapping(uint => S_Payment) _payments;
    }

    mapping(uint => S_Item) public items;

    function createItem(string memory _name, uint _price, uint _quantity) public {
        Item item = new Item(_name, _price, msg.sender, block.timestamp, index, address(this));

        items[index]._identifier = _name;
        items[index]._itemOwner = msg.sender;
        items[index]._price = _price;
        items[index]._quantity = _quantity;
        items[index]._timeCreated = block.timestamp;
        items[index]._item = item;

        emit ItemEvent(index, address(item));
        index++;
    }

    function triggerPayment(uint _itemIndex, uint _quantity) public payable {
        require(msg.sender == address(items[_itemIndex]._item), "Function not called from Item Contract.");
        require(_quantity >= 1, "Need 1 or more to purchase.");
        require(_quantity <= items[_itemIndex]._quantity, "Not enough in stock.");
        require(msg.value == items[_itemIndex]._price * _quantity, "Must pay specified price."); 

        uint purchaseIndex = items[_itemIndex]._purchases;
        uint comission = msg.value * 5 / 100;
        uint itemOwnerPay = msg.value - comission;
        address itemOwner = items[_itemIndex]._itemOwner;

        (bool itemOwnerSuccess, ) = itemOwner.call{ value: itemOwnerPay }('');
        require(itemOwnerSuccess, "Payment did not send successfully. Please try again.");
        (bool ownerSuccess, ) = owner.call{ value: comission }('');
        require(ownerSuccess, "Payment did not send successfully. Please try again.");

        items[_itemIndex]._payments[purchaseIndex]._item = address(items[_itemIndex]._item);
        items[_itemIndex]._payments[purchaseIndex]._buyer = msg.sender;
        items[_itemIndex]._payments[purchaseIndex]._value = msg.value;
        items[_itemIndex]._payments[purchaseIndex]._quantity = _quantity;
        items[_itemIndex]._payments[purchaseIndex]._timePurchased = block.timestamp;
        items[_itemIndex]._payments[purchaseIndex]._status = SupplyStatus.Purchased;

        items[_itemIndex]._purchases++;
        items[_itemIndex]._quantity -= _quantity;
    }

    function editItem(uint _index, address _itemOwner, uint _price, uint _quantity) public {
        require(msg.sender == address(items[_index]._item), "Funciton not called from Item Contract.");
        items[_index]._itemOwner = _itemOwner;
        items[_index]._price = _price;
        items[_index]._quantity = _quantity;
    }

    function returnOwner() public view returns(address) {
        return owner;
    }
}