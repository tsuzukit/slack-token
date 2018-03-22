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

db = mongoose.connect(endpoint);
let model = mongoose.model('User', User);

exports.User = model;
exports.db = db;
