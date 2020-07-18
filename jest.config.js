module.exports = {
  testPathIgnorePatterns: [`node_modules`, `\\.cache`, `<rootDir>.*/public`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
  transform: {
    '^.+\\.jsx?$': `<rootDir>/jest-preprocess.js`,
  },
}
