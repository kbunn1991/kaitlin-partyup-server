'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const User = require('../models/users');
const seedUsers = require('../db/seed/users')

const {TEST_DATABASE_URL} = require('../config');
const {dbConnect, dbDisconnect} = require('../db-mongoose');
// const {dbConnect, dbDisconnect} = require('../db-knex');

// Set NODE_ENV to `test` to disable http layer logs
// You can do this in the command line, but this is cross-platform
process.env.NODE_ENV = 'test';

// Clear the console before each run
process.stdout.write('\x1Bc\n');

const expect = chai.expect;
chai.use(chaiHttp);

before(function() {
  return dbConnect(TEST_DATABASE_URL)
    .then(() => mongoose.connection.db.dropDatabase());
});

beforeEach(function () {
  return Promise.all([
    User.insertMany(seedUsers)
  ])
});

afterEach(function () {
  return mongoose.connection.db.dropDatabase();
});

after(function() {
  return dbDisconnect();
});

describe('Mocha and Chai', function() {
  it('should be properly setup', function() {
    expect(true).to.be.true;
  });
});

describe('GET /api/users', function () {
  it ('should return the list of users', function () {
    return Promise.all([
      User.find()
      .then(([data, res]) => {
        expect(res).to.be.json;
      })
    ])
  })
})