const debug = require('debug')('jest-mongodb:teardown');
const globalConfig = require('./global-config');

module.exports = async function () {
  debug('Teardown mongod');
  await global.__MONGOD__.stop();
  await globalConfig.remove();
};
