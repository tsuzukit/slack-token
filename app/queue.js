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

queue.process('transfer', async (job, ctx, done) => {

  console.log('Processing job ' + job.id);
  let tx = null;
  await Ethereum.sendToken('0x' + job.data.to, async (hash) => {
    tx = hash;
    await reactionService.findByIdAndUpdateTx(job.data.reactionId, hash);
    console.log('Tx is issued');
  });

  // check receipt and mark success
  let waitCount = 0;
  let result = null;
  while (result == null && waitCount <= 120) {
    console.log('Checking receipt...' + waitCount);
    if (tx != null) {
      result = await Ethereum.getReceipt(tx);
    }
    waitCount += 1;
    sleep.sleep(1);
  }
  if (result != null) {
    console.log('Result found!');
    reactionService.updateStatusToComplete(job.data.reactionId,
      result.blockHash,
      result.blockNumber,
      result.cumulativeGasUsed,
      result.gasUsed);
  } else {
    console.log('Result not found!');
  }
  done();
});
