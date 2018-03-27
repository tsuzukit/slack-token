const UserService = require('../service/user').service;
const ReactionService = require('../service/reaction').service;

let get = async (req, res, next) => {

  let initialTokenBalance = 10000;

  let num_users = await UserService.count();
  let num_reactions = await ReactionService.count();
  let num_tokens_left = initialTokenBalance - await ReactionService.countTx();

  let completedTransactions = await ReactionService.findCompleted();
  let processingTransactions = await ReactionService.findProcessing();

  res.render('index', {
    num_users : num_users,
    num_reactions : num_reactions,
    num_tokens_left : num_tokens_left,
    completed_transactions: completedTransactions,
    processing_transactions: processingTransactions,
  });

};

exports.get = get;