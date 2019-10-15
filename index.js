require('dotenv').config();

const { CONNECTION_STRING, PORT } = process.env;

const { Client } = require('pg');

const client = new Client({
  connectionString: CONNECTION_STRING,
});

client.connect(err => { 
    if (err) {
        console.log('Connection error')
    } else { 
        console.log('Connected to db')
    }
})

const express = require('express');

const users = [];

const app = express();
app.use(express.json());

const bcrypt = require('bcrypt');
const axios = require('axios');

app.post('/auth/signup', (request, response) => {
  const { username, password } = request.body;

  /* Make sure the user does not exist */


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

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
