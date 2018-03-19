let mongoose = require('mongoose');
let Schema = mongoose.Schema;
require('dotenv').config();

const mongoDatabase = process.env.MONGO_DATABASE;
const endpoint = 'mongodb://mongo/' + mongoDatabase;

let Account = new Schema({
  id: String,
  password: String,
  slack_user_id: String,
  address: String,
});

db = mongoose.connect(endpoint);

exports.Account = mongoose.model('Account', Account);
exports.db = db;
