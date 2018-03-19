let model = require('../mongo/model');
require('dotenv').config();
const crypt = require('../util/crypt');


let get = async (req, res, next) => {

  res.send({
    'status': 1
  });

};

let post = async (req, res, next) => {

  // TODO validation
  // make sure id and password is present
  // if data is present with id, return error
  let id = req.body.id;
  let password = req.body.password;
  let address = req.body.address;
  let slack_user_id = req.body.slack_user_id;

  await new model.Account({
    id: id,
    password: crypt.encrypt(password),
    address: address,
    slack_user_id: slack_user_id,
  }).save();

  res.send({
    'status': 0,
  });

};

exports.post = post;
exports.get = get;
