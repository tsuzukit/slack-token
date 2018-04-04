const abiJson = require('../contract/build/contracts/CustomToken');

let get = async (req, res, next) => {
  res.status(200).send(abiJson);
};

exports.get = get;
