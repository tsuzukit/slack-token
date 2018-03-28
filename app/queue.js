let kue = require('kue');
const sleep = require('sleep');
const Ethereum = require('./util/etherum');
const reactionService = require('./service/reaction').service;

let queue = kue.createQueue({
  prefix: 'q',
  redis: {
    host: 'redis',
  }
});

queue.process('transfer', async (job, done) => {
  console.log('Processing job ' + job.id);
  const result = await Ethereum.sendToken('0x' + job.data.to);
  if (result != null) {
    const tx = result.transactionHash;
    await reactionService.findByIdAndUpdateTx(job.data.reactionId, tx);
  }
  console.log('Job ' + job.id + ' is complete. Now wait or some time to grant another token');

  // wait some time before invoking another transaction. Otherwise nonce will not match and transaction will fail.
  // TODO fix me
  const waitTime = 120; // sec
  sleep.sleep(waitTime); // sec

  console.log('Waiting is done and now ready for new job.\n');
  done();
});
