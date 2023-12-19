module.exports = {
  testEnvironment: 'node',
  setupFiles: ['./jest.setup.js'],
  testRegex: 'tests/.*\\.test\\.js$',
  testEnvironmentOptions: {
    // Add an environment variable to specify the database environment
    DATABASE_ENV: process.env.DATABASE_ENV || 'test',
  },
};
