'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const User = require('./models/users');
const Group = require('./models/groups');
const bodyParser = require('express');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const app = express();

app.use(express.json());

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.get ('/api/groups', (req,res,next) => {
  // const { searchTerm } = req.query;
  
  // const searchGroup = {games: {$in: searchTerm}};

  // if (searchTerm) {
  //   return User.find(searchGame).sort({username: 1})
  //   .then(results => {
  //     console.log(results);
  //     return res.status(200).json(results);
  //   })
  // } else if (!searchTerm) {
  return Group.find()
    .then(results => {
      console.log(results);
      return res.json(results);
    })
    .catch(err => {
      next(err);
    })
  // };
})

// GET ALL USERS

app.get ('/api/users', (req,res,next) => {
  const { searchTerm } = req.query;
  
  const searchGame = {games: {$in: searchTerm}};

  if (searchTerm) {
    return User.find(searchGame).sort({username: 1})
    .then(results => {
      console.log(results);
      return res.status(200).json(results);
    })
  } else if (!searchTerm) {
  return User.find().sort({username: 1})
    .then(results => {
      console.log(results);
      return res.json(results);
    })
    .catch(err => {
      next(err);
    })
  };
})

app.get('/api/users/:id', (req,res,next) => {
  const id = req.params.id;

  return User.findById(id)
  .then(result => {
    if(result) {
      res.json(result).status(200);
    } else {
      next();
    }
  })
  .catch(err => {
    next(err);
  })
})

// REGISTER

app.post('/api/users', (req,res,next) => {
  const username = req.body.username;
  const password = req.body.password;
  
  const newUser = { username, password };

  User.create(newUser)
    .then(result => {
      res.location(`${req.originalUrl}`).status(201).json(result)
    })
    .catch(err => {
      next(err);
    })
})

// LOGIN

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
