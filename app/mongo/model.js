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
  to_user_id: String,
  reaction: String,
  ts: String,
});

db = mongoose.connect(endpoint);
let userModel = mongoose.model('User', User);
let ReactionModel = mongoose.model('Reaction', Reaction);

exports.User = userModel;
exports.Reaction = ReactionModel;
exports.db = db;
