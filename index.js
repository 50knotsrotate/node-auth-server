require('dotenv').config();

const { CONNECTION_STRING, PORT } = process.env;

const { Client } = require('pg');

const client = new Client({
  connectionString: CONNECTION_STRING,
});

client.connect((err) => {
  if (err) {
    console.log('Connection error');
  } else {
    console.log('Connected to db');
  }
});

client.query('DROP TABLE IF EXISTS TEST_USERS', (err, res) => {
  if (err) throw err;
  console.log('TABLE DROPPED');
});

client.query(
  'CREATE TABLE TEST_USERS(ID SERIAL PRIMARY KEY, username VARCHAR(15) not null, password VARCHAR(30) not null)',
  (err) => {
    if (err) throw err;
    console.log('TEST_USERS created');
  },
);

const express = require('express');

const users = [];

const app = express();
app.use(express.json());

const bcrypt = require('bcrypt');
const axios = require('axios');

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
          console.log(response);
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
    const values = [username, password];
    client.query(query, values, (err, res) => {
      if (err) {
        response.status(200).send(err);
      } else {
        response.status(200).send(res.rows);
      }
    });
  },
);

module.exports = app;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
