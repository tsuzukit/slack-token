exports.isAddress = function (text) {
  const row = text.replace('0x', '');
  const regex = /[0-9A-Fa-f]{40}/;
  return regex.test(row);
};

