const https = require("https");
const EmojiDict = require('../util/emoji').emoji;
let model = require('../mongo/model');
let Emoji = model.Emoji;
require('dotenv').config();

let EmojiService = function () {};

EmojiService.create = async (name, code, url, alias) => {
  const emojis = await Emoji.find({name: name}).exec();
  if (emojis.length >= 1) {
    let emoji = emojis[0];
    emoji.code = code;
    emoji.url = url;
    emoji.alias = alias;
    emoji.save();
    return emoji;
  }

  try {
    return await new Emoji({
      name: name,
      code: code,
      url: url,
      alias: alias,
    }).save();
  } catch (err) {
    console.log(err);
    return null;
  }
};

let emojiUrl = 'https://slack.com/api/emoji.list?token=' + process.env.SLACK_TOKEN;
EmojiService.initialize = () => {
  https.get(emojiUrl, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
      body += data;
    });
    res.on("end", () => {
      body = JSON.parse(body);
      let emojis = body.emoji;
      for (key in emojis) {
        let value = emojis[key];
        if (value.startsWith('alias:')) {
          let alias = value.split(':')[1];
          EmojiService.create(key, '', '', alias);
        } else {
          EmojiService.create(key, '', emojis[key], '');
        }
      }
    });
  });
};

EmojiService.getCodeOrUrl = async (name) => {
  let code = EmojiDict[name];
  if (code != null) {
    return code;
  }
  const emojis = await Emoji.find({ name: name }).exec();
  if (emojis.length <= 0) {
    return '';
  }
  let emoji = emojis[0];
  if (emoji.alias != null && emoji.alias != '') {
    return EmojiDict[emoji.alias];
  }
  return emoji.url;
};

exports.service = EmojiService;

