let model = require('../mongo/model');
require('dotenv').config();
const crypt = require('../util/crypt');

let post = async (req, res, next) => {

  console.log(req.body);

  res.send({
    'status': 0,
  });

};

exports.post = post;
