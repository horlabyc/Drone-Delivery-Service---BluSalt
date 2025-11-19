const path = require('path');
const { TsJestTransformer } = require('ts-jest');

module.exports = new TsJestTransformer({
  tsconfig: path.join(__dirname, 'tsconfig.test.json'),
});
