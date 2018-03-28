require('dotenv').config();
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(process.env.INFURA_ENDPOINT);
const web3 = new Web3(provider);

const compiledToken = require('../contract/build/contracts/CustomToken');
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(compiledToken.abi, contractAddress);

exports.isAddress = (text) => {
  const row = text.replace('0x', '');
  const regex = /[0-9A-Fa-f]{40}/;
  return regex.test(row);
};

exports.getBalanceOfOwner = async () => {
  const address = process.env.SERVER_ACCOUNT_ADDRESS;
  return await contract.methods.balanceOf(address).call();
};

exports.sendToken = async (to) => {
  const address = process.env.SERVER_ACCOUNT_ADDRESS;
  const privateKey = process.env.SERVER_ACCOUNT_PRIVATE_KEY;
  const encodedData = contract.methods.transfer(to, "1000000000000000000").encodeABI();
  const transactionObject = {
    gas: "5000000",
    gasPrice: "1000000000",
    data: encodedData,
    from: address,
    to: contractAddress
  };

  try {
    const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, privateKey);
    return await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
  }
  catch (err) {
    console.log(err);
    return null;
  }

};
