const { rebuildDB } = require('./seedData.js');

rebuildDB()
  .catch(console.error)
