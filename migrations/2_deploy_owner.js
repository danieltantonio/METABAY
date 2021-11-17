var Owner = artifacts.require("./Ownable.sol");

module.exports = function(deployer) {
  deployer.deploy(Owner);
};
