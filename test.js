const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./index.js');

const should = chai.should();

chai.use(chaiHttp);

describe('Signup', () => {
  it('Should give an error if username is missing', (done) => {
    chai
      .request(server)
      .post('/auth/signup')
      .send({ password: '12345' })
      .end((err, res) => {
        res.status.should.be.eq(500);
        res.text.should.be.eq('Username is required');
        done();
      });
  });

  it('Should give an error if password is missing', (done) => {
    chai
      .request(server)
      .post('/auth/signup')
      .send({ username: 'patrick123' })
      .end((err, res) => {
        res.status.should.be.eq(500);
        res.text.should.be.eq('Password is required');
        done();
      });
  });

  it('Should not allow empty usernames', (done) => {
    chai
      .request(server)
      .post('/auth/signup')
      .send({
        username: '',
        password: 'testpassword',
      })
      .end((err, res) => {
        res.status.should.be.eq(500);
        res.text.should.be.eq('Username is required');
        done();
      });
  });

  it('should not empty password', (done) => {
    chai
      .request(server)
      .post('/auth/signup')
      .send({
        username: 'patrick123',
        password: '',
      })
      .end((err, res) => {
        res.status.should.be.eq(500);
        res.text.should.be.eq('Password is required');
        done();
      });
  });
});


// describe('Database', () => {
//   it('should not let you push to Db without username present', (done) => {
//     chai
//       .request(server)
//       .post('/auth/signup')
//       .send({ password: '12345' })
//       .end((err, res) => {
//         res.body.detail.should.be.eq('Failing row contains (1, null, 12345).');
//         done();
//       });
//   });

//   it('Should not let you push to DB without a password', (done) => {
//     chai
//       .request(server)
//       .post('/auth/signup')
//       .send({ username: 'Username123' })
//       .end((err, res) => {
//         // eslint-disable-next-line dot-notation
//         res.body['detail'].should.be.eq(
//           'Failing row contains (2, Username123, null).',
//         );
//         done();
//       });
//   });
