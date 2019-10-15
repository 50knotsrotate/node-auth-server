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
  (err, res) => {
    // if (err) throw err;
    console.log('TEST_USERS created');
  },
);

const express = require('express');

const users = [];

const app = express();
app.use(express.json());

const bcrypt = require('bcrypt');
const axios = require('axios');

app.post('/auth/signup', (request, response) => {
  const { username, password } = request.body;
  if (!username) {
    return response.status(500).send('Username is required');
  } if (!password) {
    return response.status(500).send('Password is required');
  }

  /* Make sure the user does not exist */
  const query = 'INSERT INTO TEST_USERS(username, password) VALUES($1, $2) RETURNING *';
  const values = [username, password];

  client.query(query, values, (err, res) => {
    if (err) {
      //  console.log(err.name)
    } else {
      console.log(res);
    }
  });

  response.status(200).json({
    username,
    password,
  });
});

// eslint-disable-next-line func-names
// app.get('/:message', (req, res) => {
//   const { message } = req.params;
//   users.push(message);
//   return res.status(200).send({
//     5: '5',
//   });
// });

module.exports = app;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
