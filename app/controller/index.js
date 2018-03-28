require('dotenv').config();
const Emoji = require('../util/emoji').emoji;
const UserService = require('../service/user').service;
const ReactionService = require('../service/reaction').service;
const Ethereum = require('../util/etherum');

let get = async (req, res, next) => {
  let contractUrl = process.env.ETHERESCAN_URL + '/token/' + process.env.CONTRACT_ADDRESS;

  let ownerBalance = await Ethereum.getBalanceOfOwner();
  ownerBalance = ownerBalance.slice(0, -18);

  let numUsers = await UserService.count();
  let numReactions = await ReactionService.count();

  let completedTransactions = await ReactionService.findCompleted();
  completedTransactions.forEach(function (value, key){
    value.reaction = '&#x' + Emoji[value.reaction];
    value.tx_link = process.env.ETHERESCAN_URL + '/tx/' + value.tx;
  });
  let processingTransactions = await ReactionService.findProcessing();
  processingTransactions.forEach(function (value, key){
    value.reaction = '&#x' + Emoji[value.reaction];
  });

  let numCompletedTransactions = await ReactionService.countCompleted();
  let numProcessingTransactions = await ReactionService.countProcessing();

  res.render('index', {
    contract_url: contractUrl,
    num_users : numUsers,
    num_reactions : numReactions,
    num_tokens_left : ownerBalance,
    completed_transactions: completedTransactions,
    processing_transactions: processingTransactions,
    num_completed_transactions: numCompletedTransactions,
    num_processing_transactions: numProcessingTransactions,
  });

};

exports.get = get;
