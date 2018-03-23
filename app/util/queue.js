let kue = require('kue');

let queue = kue.createQueue({
  prefix: 'q',
  redis: {
    host: 'redis',
  }
});

exports.enqueue = (to, reactionId) => {
  queue.create('transfer', {
    to: to,
    reactionId: reactionId
  }).save();
};


