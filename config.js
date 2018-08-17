require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  DATABASE_URL:
        process.env.DATABASE_URL || 'mongodb://kbunn1991:kaitlin1@ds113942.mlab.com:13942/party-up',
  TEST_DATABASE_URL:
        process.env.TEST_DATABASE_URL ||
        'mongodb://kbunn1991:kaitlin1@ds113942.mlab.com:13942/party-up-test',
  JWT_SECRET: process.env.JWT_SECRET || 'SOMETHING',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d'
  // DATABASE_URL:
  //     process.env.DATABASE_URL || 'postgres://localhost/thinkful-backend',
  // TEST_DATABASE_URL:
  //     process.env.TEST_DATABASE_URL ||
  //     'postgres://localhost/thinkful-backend-test'
};
