let mongoose = require('mongoose');
let Schema = mongoose.Schema;
require('dotenv').config();

const mongoDatabase = process.env.MONGO_DATABASE;
const endpoint = 'mongodb://mongo/' + mongoDatabase;

let User = new Schema({
  id: String,
  slack_user_name: String,
  slack_user_id: String,
  address: String,
});

let Reaction = new Schema({
  id: String,
  from_user_id: String,
  from_address: String,
  to_user_id: String,
  to_address: String,
  reaction: String,
  tx: String,
  status: String,
  blockHash: String,
  blockNumber: String,
  cumulativeGasUsed: String,
  gasUsed: String,
  ts: String,
});

let Emoji = new Schema({
  id: String,
  name: String,
  code: String,
  url: String,
  alias: String,
});

db = mongoose.connect(endpoint);
let userModel = mongoose.model('User', User);
let ReactionModel = mongoose.model('Reaction', Reaction);
let emojiModel = mongoose.model('Emoji', Emoji);

exports.User = userModel;
exports.Reaction = ReactionModel;
exports.Emoji = emojiModel;
exports.db = db;
