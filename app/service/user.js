let model = require('../mongo/model');
let User = model.User;
require('dotenv').config();

let UserService = function () {};

UserService.findBySlackUserId = async (slackUserId) => {
  try {
    const users = await User.find({slack_user_id: slackUserId}).exec();
    if (users.length >= 1) {
      return users[0];
    }
    return null;
  } catch (err) {
    return null;
  }
};

UserService.createOrUpdate = async (userId, userName, address) => {
  try {
    const users = await User.find({ slack_user_id: userId }).exec();
    if (users.length >= 1) {
      let user = users[0];
      user.slack_user_name = userName;
      user.address = address;
      user.save();
    } else {
      let user = new User({
        slack_user_name: userName,
        slack_user_id: userId,
        address: address,
      }).save();
    }
    return true;
  } catch (err) {
    return false;
  }
};

exports.service = UserService;

