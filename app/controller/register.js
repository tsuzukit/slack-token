require('dotenv').config();
const ethereum = require('../util/etherum');
const UserService = require('../service/user').service;

let post = async (req, res, next) => {

  const verificationToken = process.env.SLACK_VERIFICATION_TOKEN;
  if (req.body.token !== verificationToken) {
    res.status(200).send({ text: 'Oops! Something went wrong!' });
    return;
  }

  // TODO channel チェックする

  const userId = req.body.user_id;
  const userName = req.body.user_name;
  const address = req.body.text.replace('0x', '');
  if (address == null || address == '') {
    res.status(200).send({ text: 'Hello `' + userName + '`. Please specify ethereum address!' });
    return;
  }
  if (!ethereum.isAddress(address)) {
    res.status(200).send({ text: 'Hello `' + userName + '`. `' + address + '` is not valid ethereum address!' });
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
