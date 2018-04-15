require('dotenv').config();
const Ethereum = require('../util/etherum');
const UserService = require('../service/user').service;

let post = async (req, res, next) => {

  const userId = req.body.user_id;
  const userName = req.body.user_name;
  const address = req.body.text.replace('0x', '');
  if (address == null || address == '') {
    res.status(200).send({ text: 'Hello `' + userName + '`. Please specify ethereum address!' });
    return;
  }
  if (!Ethereum.isAddress(address)) {
    res.status(200).send({ text: 'Hello `' + userName + '`. `' + address + '` is not valid ethereum address!' });
    return;
  }
  if (!Ethereum.isValidChecksumAddress(address)) {
    res.status(200).send({ text: 'Hello `' + userName + '`. `' + address + '` is not valid! Use address with checksum defined with EIP55.' });
    return;
  }

  let result = UserService.createOrUpdate(userId, userName, address);
  if (result) {
    res.send({'text': 'Hello `' + userName + '`. `' + address + '` is registered!'});
  } else {
    res.status(200).send({ text: 'Oops! Something went wrong!' });
  }

};

exports.post = post;
