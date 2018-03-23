require('dotenv').config();
const ethereum = require('../util/etherum');
const ReactionService = require('../service/reaction').service;
const UserService = require('../service/user').service;

let post = async (req, res, next) => {

  const verificationToken = process.env.SLACK_VERIFICATION_TOKEN;
  if (req.body.token !== verificationToken) {
    res.status(200).send({ text: 'Oops! Something went wrong!' });
    return;
  }

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

  ReactionService.create(fromUserId, toUserId, reaction, ts);

  // 1. find user
  const user = await UserService.findBySlackUserId(toUserId);
  if (user == null) {
    res.status(500).send({});
    return;
  }

  // 2. check emoji
  const targetEmojis = process.env.EMOJI.split(',');
  const isTarget = process.env.EMOJI === '' || targetEmojis.includes(reaction);

  // 3. invoke worker


  res.status(200).send({status: 0});
};

exports.post = post;
