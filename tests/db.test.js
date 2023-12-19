// db.test.js
const { rebuildDB } = require('../db/seedData');

test('Setup Database', async () => {
  const databaseEnvironment = process.env.DATABASE_ENV;
  console.log(`Testing against ${databaseEnvironment} database`);

  await rebuildDB();
});
