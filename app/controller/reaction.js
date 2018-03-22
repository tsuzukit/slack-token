require('dotenv').config();
const ethereum = require('../util/etherum');
const ReactionService = require('../service/reaction').service;

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
  const ts = req.body.event.event_ts;

  let result = ReactionService.create(fromUserId, toUserId, reaction, ts);
  res.status(200).send({});

};

exports.post = post;
