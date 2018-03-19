let crypt = require('../util/crypt');
require('should');

describe('crypt', function() {

  it('encrypt and decrypt text', () => {
    let encrypted = crypt.encrypt("Some random string for test");
    let decrypted = crypt.decrypt(encrypted);
    decrypted.should.equal('Some random string for test');
  });

});

