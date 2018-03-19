const routes = require('../routes/index');
const request = require('supertest');
let app = require('../app');
require('should');

describe('routes', () => {

  it('index',  (done) => {

    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect((res) => {
        res.status.should.equal(200);
        res.text.should.equal('{"status":1}');
      })
      .end((err, res) => {
        if(err){
          throw err;
        }
        done();
      });

  });

});


