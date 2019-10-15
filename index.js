require('dotenv').config();

const { CONNECTION_STRING, PORT } = process.env;

const express = require('express');

const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());

const { Client } = require('pg');

const client = new Client({
  connectionString: CONNECTION_STRING,
});

client.connect((err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.log('Error trying to connect to database');
  }
});

client.query('DROP TABLE IF EXISTS TEST_USERS', (err) => {
  if (err) throw err;
});

client.query(
  'CREATE TABLE TEST_USERS(ID SERIAL PRIMARY KEY, username VARCHAR(15) not null, password VARCHAR(90) not null)',
  (err) => {
    if (err) throw err;
  },
);


app.post(
  '/auth/signup',
  // eslint-disable-next-line consistent-return
  (req, res, next) => {
    const { username, password } = req.body;
    if (!username) {
      return res.status(500).send('Username is required');
    }
    if (!password) {
      return res.status(500).send('Password is required');
    }

    next();
  },
  (req, res, next) => {
  /* Here we will check if the username was already taken */
    const { username } = req.body;
    client.query('SELECT * FROM TEST_USERS WHERE USERNAME=$1', [username], (err, response) => {
      if (response.rows.length > 0) {
        res.status(500).send('Username is taken');
      } else {
        next();
      }
    });
  },
  (request, response) => {
    const { username, password } = request.body;
    const query = 'INSERT INTO TEST_USERS(username, password) VALUES($1, $2) RETURNING *';
    bcrypt.hash(password, 2, (err, hash) => {
      const values = [username, hash];
      client.query(query, values, (error, res) => {
        if (error) {
          response.status(200).send('error');
        } else {
          response.status(200).send(res.rows[0]);
        }
      });
    });
  },
);

app.post('/auth/signin', (req, res, next) => {
/* Make sure the user actually submitted both username and password
Should I just check for this on the front end before its sent to the server? */
  const { username, password } = req.body;
  if (!username) {
    res.status(500).send('Username is required');
  } else if (!password) {
    res.status(500).send('Password is required');
  } else {
    next();
  }
}, (req, res, next) => {
  /* Check to see if username exists */
  const { username } = req.body;

  const query = 'SELECT * FROM TEST_USERS WHERE USERNAME=$1';

  const values = [username];

  client.query(query, values, (_err, response) => (response.rows.length ? next() : res.status(500).send('That username does not exist')));
}, (req, res) => {
  /* Here we will check if the username matches the password */
  const { username, password } = req.body;

  const query = 'SELECT * FROM TEST_USERS WHERE USERNAME=$1';

  const values = [username];

  client.query(query, values, (err, _response) => {
    const hashed = _response.rows[0].password;

    bcrypt.compare(password, hashed, (_err, bool) => (bool ? res.status(200).send(_response.rows[0]) : res.status(500).send('Password is incorrect')));
  });
});

module.exports = app;

app.listen(PORT);
