require('dotenv').config();
const express = require('express');

const users = [];

const app = express();
app.use(express.json());

const bcrypt = require('bcrypt');
const axios = require('axios');

const { CONNECTION_STRING, PORT } = process.env;
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

app.listen(3000, () => {
  console.log("ayyy");
});
