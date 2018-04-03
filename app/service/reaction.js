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
      tx: tx,
      status: 'in_queue',
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
      reaction.status = 'processing';
      reaction.save();
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}
;
ReactionService.updateStatusToComplete = async (id, blockHash, blockNumber, cumulativeGasUsed, gasUsed) => {
  try {
    const reactions = await Reaction.find({_id: id}).exec();
    if (reactions.length >= 1) {
      let reaction = reactions[0];
      reaction.status = 'complete';
      reaction.blockHash = blockHash;
      reaction.blockNumber = blockNumber;
      reaction.cumulativeGasUsed = cumulativeGasUsed;
      reaction.gasUsed = gasUsed;
      reaction.save();
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};

ReactionService.findComplete = async () => {
  try {
    return await Reaction.find( { status: 'complete' } ).sort([['ts', -1]]).limit(40).exec();
  } catch (err) {
    return [];
  }
};

ReactionService.countComplete = async () => {
  try {
    return await Reaction.count( { status: 'complete' } );
  } catch (err) {
    return [];
  }
};

ReactionService.findProcessing = async () => {
  try {
    return await Reaction.find( { status: 'processing' } ).sort([['ts', -1]]).limit(20).exec();
  } catch (err) {
    return [];
  }
};

ReactionService.countProcessing = async () => {
  try {
    return await Reaction.count( { status: 'processing' } );
  } catch (err) {
    return [];
  }
};

ReactionService.findInQueue = async () => {
  try {
    return await Reaction.find( { status: 'in_queue' } ).sort([['ts', -1]]).limit(20).exec();
  } catch (err) {
    return [];
  }
};

ReactionService.countInQueue = async () => {
  try {
    return await Reaction.count( { status: 'in_queue' } );
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

