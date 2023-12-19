const { Pool } = require('pg');

let connectionString;

if (process.env.NODE_ENV === 'production') {
  // Production URL
  connectionString = process.env.DATABASE_URL;
} else if (process.env.NODE_ENV === 'test') {
  // Test Database
  connectionString = process.env.TEST_DATABASE_URL || 'postgres://cole@localhost:5432/parkMarket-test';
} else {
  // Development Database
  connectionString = process.env.DATABASE_URL || 'postgres://cole@localhost:5432/parkMarket-dev';
}

const client = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

module.exports = client;
