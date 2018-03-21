let model = require('../mongo/model');
require('dotenv').config();
const ethereum = require('../util/etherum');

let post = async (req, res, next) => {

  // TODO remove later
  console.log(req.body);

  const verificationToken = process.env.SLACK_VERIFICATION_TOKEN;
  if (req.body.token !== verificationToken) {
    res.status(500).send({ error: 'Something failed!' });
    return;
  }

  const userId = req.body.user_id;
  const userName = req.body.user_name;
  const address = req.body.text;
  if (address == null || address == '') {
    res.status(200).send({ text: 'Hello ' + userName + '. Please specify ethereum address!' });
    return;
  }
  if (!ethereum.isAddress(address)) {
    res.status(200).send({ text: 'Hello ' + userName + '. ' + address + ' is not valid ethereum address!' });
    return;
  }

  res.send({
    'status': 0,
  });

};

exports.post = post;
