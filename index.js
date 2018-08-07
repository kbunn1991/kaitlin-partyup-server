'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const User = require('./models/users');
const Group = require('./models/groups');

const passport = require('passport');
const localStrategy = require('./passport/local');
const authRouter = require('./routes/auth');
const jwtStrategy = require('./passport/jwt');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const app = express();
app.use(express.json());

passport.use(localStrategy);
passport.use(jwtStrategy);

// MOUNT THE APP ROUTER
app.use('/api', authRouter);

// Protect endpoints using JWT Strategy
// router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));


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

// GET GROUPS

app.get ('/api/groups', (req,res,next) => {
  return Group.find()
    .then(results => {
      console.log(results);
      return res.json(results);
    })
    .catch(err => {
      next(err);
    })
})

// MAKE GROUP

app.post('/api/groups', (req,res,next) => {
  const groupName = req.body.groupName;
  
  const newGroup = { groupName };

  Group.create(newGroup)
    .then(result => {
      res.location(`${req.originalUrl}`).status(201).json(result)
    })
    .catch(err => {
      next(err);
    })
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
  
  return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        username,
        password: digest
      };
      return User.create(newUser);
    })
    .then(result => {
      return res.status(201).location(`/api/users/${result.id}`).json(result);
    })
    .catch(err => {
      next(err)
    })
  // User.create(newUser)
  //   .then(result => {
  //     res.location(`${req.originalUrl}`).status(201).json(result)
  //   })
  //   .catch(err => {
  //     next(err);
  //   })
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
