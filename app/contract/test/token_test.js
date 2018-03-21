const CustomToken = artifacts.require("CustomToken");

contract('Token のテスト', async (accounts) => {

  it("Token は Deploy されているはずだ", async () => {
    let customToken = await CustomToken.deployed();
    assert.ok(customToken.address);
  });

  it("Token のコンストラクタに渡した情報は反映されているはずだ", async () => {
    let customToken = await CustomToken.deployed();
    let name = await customToken.name.call();
    let symbol = await customToken.symbol.call();
    let decimals = await customToken.decimals.call();
    let totalSupply = await customToken.totalSupply.call();
    assert.equal('Suki Suki Dan Token', name);
    assert.equal('SSDT', symbol);
    assert.equal(18, decimals);
    assert.equal(10000e18, totalSupply);
  });

  it("Token の owner は address[0] のはずだ", async () => {
    let customToken = await CustomToken.deployed();
    let owner = await customToken.owner.call();
    assert.equal(accounts[0], owner);
  });

  it("Token の owner は tokenHolders のはずだ", async () => {
    let customToken = await CustomToken.deployed();
    let tokenHolders = await customToken.getTokenHolders.call();
    assert.equal(accounts[0], tokenHolders[0]);
  });

  it("Token は account 同士で transfer 可能なはずだ", async () => {
    let customToken = await CustomToken.deployed();

    let account0Balance = await customToken.balanceOf.call(accounts[0]);
    assert.equal(1e22, account0Balance.toNumber());

    let account1Balance = await customToken.balanceOf.call(accounts[1]);
    assert.equal(0, account1Balance.toNumber());

    customToken.transfer(accounts[1], 1e18, {
      from: accounts[0],
    });
    account1Balance = await customToken.balanceOf.call(accounts[1]);
    assert.equal(1e18, account1Balance.toNumber());

    let tokenHolders = await customToken.getTokenHolders.call();
    assert.equal(2, tokenHolders.length);
    assert.equal(accounts[1], tokenHolders[1]);
  });

  it("交換を繰り返しても tokenHolders は同じアドレスは１つだけ持つはずだ", async () => {
    let customToken = await CustomToken.deployed();

    customToken.transfer(accounts[1], 1e18, {
      from: accounts[0],
    });

    let tokenHolders = await customToken.getTokenHolders.call();
    assert.equal(2, tokenHolders.length);
    assert.equal(accounts[1], tokenHolders[1]);
  });

  it("別のユーザーにもトークンは送れるはずだ", async () => {
    let customToken = await CustomToken.deployed();

    customToken.transfer(accounts[5], 1e18, {
      from: accounts[0],
    });

    let tokenHolders = await customToken.getTokenHolders.call();
    assert.equal(3, tokenHolders.length);
    assert.equal(accounts[5], tokenHolders[2]);
  });

});