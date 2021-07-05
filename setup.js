const {resolve} = require('path');
const MongodbMemoryServer = require('mongodb-memory-server');
const globalConfig = require('./global-config');
const cwd = process.cwd();

const debug = require('debug')('jest-mongodb:setup');
const mongod = new MongodbMemoryServer.default(getMongodbMemoryOptions());

module.exports = async () => {
  if (!mongod.isRunning) {
    await mongod.start();
  }

  const options = getMongodbMemoryOptions();
  const mongoURLEnvName = getMongoURLEnvName();

  const mongoConfig = {
    mongoUri: await mongod.getUri(),
    mongoDBName: options.instance.dbName,
  };

  // Write global config to disk because all tests run in different contexts.
  await globalConfig.write(mongoConfig);
  debug('Config is written');

  // Set reference to mongod in order to close the server during teardown.
  global.__MONGOD__ = mongod;
  process.env[mongoURLEnvName] = mongoConfig.mongoUri;
};

function getMongodbMemoryOptions() {
  try {
    const {mongodbMemoryServerOptions} = require(resolve(cwd, 'jest-mongodb-config.js'));

    return mongodbMemoryServerOptions;
  } catch (e) {
    return {
      binary: {
        skipMD5: true,
      },
      autoStart: false,
      instance: {},
    };
  }
}

function getMongoURLEnvName() {
  try {
    const {mongoURLEnvName} = require(resolve(cwd, 'jest-mongodb-config.js'));

    return mongoURLEnvName || 'MONGO_URL';
  } catch (e) {
    return 'MONGO_URL';
  }
}
