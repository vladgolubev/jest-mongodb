const fs = require('fs').promises;
const {join} = require('path');

const cwd = process.cwd();
const globalConfigPath = join(cwd, 'globalConfig.json');

module.exports = {
  path: globalConfigPath,

  async write(data) {
    return fs.writeFile(globalConfigPath, JSON.stringify(data), 'utf8');
  },

  async read() {
    return JSON.parse(await fs.readFile(globalConfigPath, 'utf8'));
  },

  async remove() {
    try {
      await fs.unlink(globalConfigPath);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
  }
};
