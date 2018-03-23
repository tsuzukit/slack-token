let model = require('../mongo/model');
let Contract = model.Contract;

let get = async (req, res, next) => {

  res.send({status: 0});

};

exports.get = get;