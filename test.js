/* eslint-disable */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./index.js');

const should = chai.should();

chai.use(chaiHttp);

describe('-SIGNUP-', () => {
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

  it('Should not empty password', (done) => {
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

  it('Should return newly created user after it is inserted into DB', (done) => {
    chai
      .request(server)
      .post('/auth/signup')
      .send({
        username: 'patrick123',
        password: 'password',
      }).end((err, res) => {
        res.body.should.be.a('object');
        res.body.username.should.be.eq('patrick123');
        /* Line below makes sure the password is hashed */
        res.body.password.should.not.eq('password');
        done();
      });
  });

  it('Should not let you create an account with a username that already exists', (done) => {
    chai
      .request(server)
      .post('/auth/signup')
      .send({
        username: 'patrick123',
        password: 'password',
      }).end((err, res) => {
        res.error.text.should.eq('Username is taken');
        done();
      });
  });
});

describe('-SIGNIN-', () => {

    it('Should give an error if username field is not present', (done) => { 
        chai.request(server)
            .post('/auth/signin')
            .send({
                password: 'password'
            }).end((err, res) => { 
                res.error.text.should.be.eq('Username is required');
                done();
            })
    })

    it('Should give an error if password field is not present', (done) => { 
        chai
          .request(server)
          .post("/auth/signin")
          .send({
            username: "patrick123"
          })
          .end((err, res) => {
            res.error.text.should.be.eq("Password is required");
            done();
          });
    })

  it('Should give an error if username does not exist', (done) => {
    chai
      .request(server)
      .post('/auth/signin')
      .send({
        username: 'NonexistantUsername123',
        password: 'SecretPassword123',
      })
      .end((err, res) => {
        res.error.text.should.be.eq('That username does not exist');
        done();
      });
  });

  it('Should give an error if password is incorrect', (done) => {
    chai.request(server)
      .post('/auth/signin')
      .send({
        username: 'patrick123',
        password: 'WrongPassword',
      })
      .end((err, res) => {
        res.error.text.should.be.eq('Password is incorrect');
        done();
      });
  });
});
