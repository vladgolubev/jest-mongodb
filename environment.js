const NodeEnvironment = require('jest-environment-node');
const uuid = require('uuid');
const globalConfig = require('./global-config');

const debug = require('debug')('jest-mongodb:environment');

module.exports = class MongoEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    debug('Setup MongoDB Test Environment');

    const mongoConfig = await globalConfig.read();

    this.global.__MONGO_URI__ = mongoConfig.mongoUri;
    this.global.__MONGO_DB_NAME__ = mongoConfig.mongoDBName || uuid.v4();

    await super.setup();
  }

  async teardown() {
    debug('Teardown MongoDB Test Environment');

    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
};
