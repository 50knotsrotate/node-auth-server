const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./index.js');

const should = chai.should();

chai.use(chaiHttp);

describe('Database', () => {
  it('should not let you push to Db without username present', () => {
    chai.request(server)
      .post('/auth/signup')
      .send({ password: '12345' })
      .end((err, res) => {
        res.text.should.be.eq('Username is required');
        res.status.should.be.eq(500);
      });
  });

  it('Should not let you push to DB without a password', () => {
    chai
      .request(server)
      .post('/auth/signup')
      .send({ username: 'Username123' })
      .end((err, res) => {
        res.text.should.be.eq('Password is required');
        res.status.should.be.eq(500);
      });
  });
});

// const should = chai.should();

// chai.use(chaiHttp

// describe('signup', () => {
//     it('does not allow you to leave username blank', () => {
//         chai.request(server)
//             .post('/auth/signup')
//             .end((err, res) => {
//                 console.log(res)
//             })
//     })
// });
