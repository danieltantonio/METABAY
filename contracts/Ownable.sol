pragma solidity ^0.8.7;

contract Ownable {
    address owner;
    
    constructor() {
        owner = msg.sender;
    }
}