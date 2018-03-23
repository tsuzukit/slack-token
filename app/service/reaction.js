let model = require('../mongo/model');
let Reaction = model.Reaction;
require('dotenv').config();

let ReactionService = function () {};

ReactionService.create = async (fromUserId, toUserId, reaction, ts, tx) => {
  try {
    return await new Reaction({
      from_user_id: fromUserId,
      to_user_id: toUserId,
      reaction: reaction,
      ts: ts,
      tx: tx
    }).save();
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.service = ReactionService;

