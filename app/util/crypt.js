require('dotenv').config();
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const password = process.env.SALT;

// TODO mitigate warning
// Warning: Use Cipheriv for counter mode of aes-256-ctr

exports.encrypt = function (text) {
  let cipher = crypto.createCipher(algorithm, password);
  let crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
};

exports.decrypt = function (text){
  let decipher = crypto.createDecipher(algorithm, password);
  let dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
};