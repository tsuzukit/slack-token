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

ReactionService.findByIdAndUpdateTx = async (id, tx) => {
  try {
    const reactions = await Reaction.find({_id: id}).exec();
    if (reactions.length >= 1) {
      let reaction = reactions[0];
      reaction.tx = tx;
      reaction.save();
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};

ReactionService.findCompleted = async () => {
  try {
    return await Reaction.find( { tx: { $ne: "" }} ).sort([['ts', -1]]).exec();
  } catch (err) {
    return [];
  }
};

ReactionService.findProcessing = async () => {
  try {
    return await Reaction.find( { tx: "" } ).sort([['ts', -1]]).exec();
  } catch (err) {
    return [];
  }
};

ReactionService.count = async () => {
  try {
    return await Reaction.count();
  } catch (err) {
    return 0;
  }
};

ReactionService.countTx = async () => {
  try {
    return await Reaction.count({ tx: { $ne: "" } });
  } catch (err) {
    return 0;
  }
};

exports.service = ReactionService;

