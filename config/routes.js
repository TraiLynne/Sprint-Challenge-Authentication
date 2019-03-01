const axios = require('axios');
const bcrypt = require('bcryptjs');

const { authenticate } = require('../auth/authenticate');
const db = require('../database/helpers/userModel');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

async function register(req, res) {
  // implement user registration
  const regInfo = req.body;
  try {
    if (!regInfo.username || regInfo.username === '') {
      res
        .status(401)
        .json({
          errorMessage: 'Please provide a username'
        })
    } else {
      let existingUser = await db.findBy({
        username: regInfo.username
      }).first();

      if(existingUser) {
        res
          .status(401)
          .json({
            errorMessage: `${regInfo.username} is already in use`
          });
      } else {
        if (!regInfo.password || regInfo.password === '' || regInfo.password.length < 12) {
          res
            .status(401)
            .json({
              errorMessage: 'Please provide a password over 12 characters'
            })
        } else {
          let hash = bcrypt.hashSync(regInfo.password, 14);

          regInfo.password = hash;

          const newUser = await db.create(regInfo);

          res
            .status(201)
            .json(newUser);
        }
      }
    }
  } catch (err) {
    res
      .status(500)
      .json('Houston, we have a problem');
  }
}

function login(req, res) {
  // implement user login
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
