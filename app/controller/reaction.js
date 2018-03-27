require('dotenv').config();
const queue = require('../util/queue');
const ReactionService = require('../service/reaction').service;
const UserService = require('../service/user').service;

let post = async (req, res, next) => {

  if (req.body.event == null) {
    res.status(200).send({ challenge: req.body.challenge });
    return;
  }

  const fromUserId = req.body.event.user;
  const toUserId = req.body.event.item_user;
  const reaction = req.body.event.reaction;
  const ts = req.body.event.event_ts ? req.body.event.event_ts.toString() : '';

  if (fromUserId == null || toUserId == null || reaction == null) {
    res.status(500).send({});
    return;
  }

  const tx = "";
  let reactionModel = await ReactionService.create(fromUserId, toUserId, reaction, ts, tx);
  if (reactionModel == null) {
    res.status(500).send({});
    return;
  }

  // 1. find user
  const user = await UserService.findBySlackUserId(toUserId);
  if (user == null) {
    // TODO user に ether address を登録するように促す
    res.status(500).send({});
    return;
  }

  // 2. check emoji
  const targetEmojis = process.env.EMOJI.split(',');
  const isTarget = process.env.EMOJI === '' || targetEmojis.includes(reaction);
  if (!isTarget) {
    res.status(500).send({});
    return;
  }

  // 3. save sending address
  const fromUser = await UserService.findBySlackUserId(fromUserId);
  reactionModel.to_address = user.address;
  reactionModel.from_address = fromUser.address;
  reactionModel.save();

  // 4. enqueu job to worker
  queue.enqueue(user.address, reactionModel._id);
  res.status(200).send({});
};

exports.post = post;
