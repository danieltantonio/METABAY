var TestStore = artifacts.require("./TestStore.sol");

module.exports = function(deployer) {
  deployer.deploy(TestStore);
};
