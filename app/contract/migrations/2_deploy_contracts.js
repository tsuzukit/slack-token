let SukiSukiDanToken = artifacts.require("./SukiSukiDanToken.sol");

module.exports = function(deployer) {
  const initialSupply = 10000e18;
  deployer.deploy(SukiSukiDanToken, initialSupply);
};
