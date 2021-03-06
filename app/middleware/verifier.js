require('dotenv').config();

let verifyToken = async (req, res, next) => {

  // token チェックする
  const token = req.body.token;
  if (token == null) {
    res.status(200).send({ text: 'Oops! Something went wrong!' });
    return;
  }

  const verificationToken = process.env.SLACK_VERIFICATION_TOKEN;
  if (token !== verificationToken) {
    res.status(200).send({ text: 'Oops! Something went wrong!' });
    return;
  }
  next();
};

let verifyChannel = async (req, res, next) => {

  // channel チェックする
  let channelId = req.body.event != null ? req.body.event.item.channel : req.body.channel_id;
  if (channelId == null) {
    res.status(500).send({});
    return;
  }

  const targetChannels = process.env.CHANNEL.split(',');
  const isTargetChannel = process.env.CHANNEL === '' || targetChannels.includes(channelId);
  if (!isTargetChannel) {
    res.status(500).send({});
    return;
  }
  next();
};

let verifyChallenge = async (req, res, next) => {

  if (req.body.challenge != null) {
    res.status(200).send({ challenge: req.body.challenge });
  }

  next();
};

exports.verifyToken = verifyToken;
exports.verifyChannel = verifyChannel;
exports.verifyChallenge = verifyChallenge;
