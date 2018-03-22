require('dotenv').config();
const ethereum = require('../util/etherum');

let post = async (req, res, next) => {

  console.log(req);

  res.status(200).send({ text: '' });

};

exports.post = post;
