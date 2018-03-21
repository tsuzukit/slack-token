let CustomToken = artifacts.require("./CustomToken.sol");

module.exports = function(deployer) {
  deployer.deploy(CustomToken);
};
