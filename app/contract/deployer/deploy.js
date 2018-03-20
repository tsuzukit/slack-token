let fs = require('fs');
let readConf = function () {
  let array = fs.readFileSync('../../.env').toString().split("\n");
  let conf = {};
  for (i in array) {
    if (array[i] == null || array[i] == '') {
      continue;
    }
    let tmp = array[i].split('=');
    conf[tmp[0]] = tmp[1];
  }
  return conf;
};
let conf = readConf();

const compiledToken = require('../build/contracts/SukiSukiDanToken');

const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(conf.INFURA_ENDPOINT);
const web3 = new Web3(provider);
const address = conf.SERVER_ACCOUNT_ADDRESS;
const privatekey = conf.SERVER_ACCOUNT_PRIVATE_KEY;
const arguments = ["10000e18"];

const bytecode = compiledToken.bytecode;
const contract = new web3.eth.Contract(compiledToken.abi);

const gas=2000000;
const gasPrice=2000000;
const gasString = parseInt(gas).toString(16);
const gasPriceString = parseInt(gasPrice).toString(16);
const data = contract.deploy({ data: bytecode, arguments: arguments }).encodeABI();
const transactionObject = {
  gas: gasString,
  gasPrice: gasPriceString,
  data: data,
  from: address,
};

deploy = async () => {

  try {
    const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, privatekey);
    const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    console.log(result);
  }
  catch (err) {
    console.log(err);
  }

};
deploy();

