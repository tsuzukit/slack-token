const SukiSukiDanToken = artifacts.require("SukiSukiDanToken");

contract('Token のテスト', async (accounts) => {

  it("Token は Deploy されているはずだ", async () => {
    let sukiSukiDanToken = await SukiSukiDanToken.deployed();
    assert.ok(sukiSukiDanToken.address);
  });

  it("Token のコンストラクタに渡した情報は反映されているはずだ", async () => {
    let sukiSukiDanToken = await SukiSukiDanToken.deployed();
    let name = await sukiSukiDanToken.name.call();
    let symbol = await sukiSukiDanToken.symbol.call();
    let decimals = await sukiSukiDanToken.decimals.call();
    let totalSupply = await sukiSukiDanToken.totalSupply.call();
    assert.equal('Suki Suki Dan Token', name);
    assert.equal('SSDT', symbol);
    assert.equal(18, decimals);
    assert.equal(10000e18, totalSupply);
  });

  it("Token の owner は address[0] のはずだ", async () => {
    let sukiSukiDanToken = await SukiSukiDanToken.deployed();
    let owner = await sukiSukiDanToken.owner.call();
    assert.equal(accounts[0], owner);
  });

  it("Token は account 同士で transfer 可能なはずだ", async () => {
    let sukiSukiDanToken = await SukiSukiDanToken.deployed();

    let account0Balance = await sukiSukiDanToken.balanceOf.call(accounts[0]);
    assert.equal(1e22, account0Balance.toNumber());

    let account1Balance = await sukiSukiDanToken.balanceOf.call(accounts[1]);
    assert.equal(0, account1Balance.toNumber());

    sukiSukiDanToken.transfer(accounts[1], 1e18, {
      from: accounts[0],
    });
    account1Balance = await sukiSukiDanToken.balanceOf.call(accounts[1]);
    assert.equal(1e18, account1Balance.toNumber());
  });

});