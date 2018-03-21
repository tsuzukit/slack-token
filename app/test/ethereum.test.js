let ethereum = require('../util/etherum');
require('should');

describe('ethereum utils', function() {

  it('checks ethereum address format', () => {
    let correct1 = ethereum.isAddress('0x123456789ABCDEF123456789abcdef123456789A');
    correct1.should.equal(true);

    let correct2 = ethereum.isAddress('123456789ABCDEF123456789abcdef123456789A');
    correct2.should.equal(true);

    // 桁が足りない
    let fail1 = ethereum.isAddress('123456789ABCDEF123456789abcdef');
    fail1.should.equal(false);

    // 16 進数以外の文字が入っている
    let fail2 = ethereum.isAddress('123456789ABCDEF123456789abcdef123456789X');
    fail2.should.equal(false);
  });

});

