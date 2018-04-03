require('dotenv').config();
const Emoji = require('../util/emoji').emoji;
const UserService = require('../service/user').service;
const EmojiService = require('../service/emoji').service;
const ReactionService = require('../service/reaction').service;
const Ethereum = require('../util/etherum');

let get = async (req, res, next) => {
  let contractUrl = process.env.ETHERESCAN_URL + '/token/' + process.env.CONTRACT_ADDRESS;

  let ownerBalance = await Ethereum.getBalanceOfOwner();
  ownerBalance = ownerBalance.slice(0, -18);

  let numUsers = await UserService.count();
  let numReactions = await ReactionService.count();

  let completeTransactions = await ReactionService.findComplete();
  completeTransactions.forEach(async (value, key) => {
    value.reaction = await EmojiService.getCodeOrUrl(value.reaction);
    value.tx_link = process.env.ETHERESCAN_URL + '/tx/' + value.tx;
  });
  let processingTransactions = await ReactionService.findProcessing();
  processingTransactions.forEach(async (value, key) => {
    value.reaction = await EmojiService.getCodeOrUrl(value.reaction);
    value.tx_link = process.env.ETHERESCAN_URL + '/tx/' + value.tx;
  });
  let inQueueTransactions = await ReactionService.findInQueue();
  inQueueTransactions.forEach(async (value, key) => {
    value.reaction = await EmojiService.getCodeOrUrl(value.reaction);
  });

  let numCompleteTransactions = await ReactionService.countComplete();
  let numProcessingTransactions = await ReactionService.countProcessing();
  let numInQueueTransactions = await ReactionService.countInQueue();

  res.render('index', {
    contract_url: contractUrl,
    num_users : numUsers,
    num_reactions : numReactions,
    num_tokens_left : ownerBalance,
    complete_transactions: completeTransactions,
    processing_transactions: processingTransactions,
    in_queue_transactions: inQueueTransactions,
    num_complete_transactions: numCompleteTransactions,
    num_processing_transactions: numProcessingTransactions,
    num_in_queue_transactions: numInQueueTransactions,
  });

};

exports.get = get;
