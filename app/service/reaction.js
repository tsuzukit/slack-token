let model = require('../mongo/model');
let Reaction = model.Reaction;
require('dotenv').config();

let ReactionService = function () {};

ReactionService.create = async (fromUserId, toUserId, reaction, ts) => {
  try {
    let reaction = new Reaction({
      from_user_id: fromUserId,
      to_user_id: toUserId,
      reaction: reaction,
      ts: ts,
    }).save();
    return true;
  } catch (err) {
    return false;
  }
};

exports.service = ReactionService;

