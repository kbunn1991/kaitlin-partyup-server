'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Group = require('./models/groups');

const passport = require('passport');
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');

const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const groupRouter = require('./routes/groups');


const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const app = express();
app.use(express.json());

passport.use(localStrategy);
passport.use(jwtStrategy);

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

// MOUNT THE ROUTERS
app.use('/api', authRouter);
app.use('/api/users', userRouter);
// app.use('/api/groups', groupRouter);
app.use('/api/groups', passport.authenticate('jwt', { session: false, failWithError: true }), groupRouter);

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
