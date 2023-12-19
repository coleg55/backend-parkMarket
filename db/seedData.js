const { createUser, createOwner } = require('./users');
require('dotenv').config();

const OWNER_PASSWORD = process.env.OWNER_PASSWORD

const client = require("./client")

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
    DROP TABLE IF EXISTS emails;
    DROP TABLE IF EXISTS posts;
    DROP TABLE IF EXISTS categories;
    DROP TABLE IF EXISTS users;
    `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            email_verified BOOLEAN DEFAULT false,
            date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_owner BOOLEAN DEFAULT false,
            is_admin BOOLEAN DEFAULT false
            CONSTRAINT is_admin_when_owner CHECK (is_owner = false OR is_admin = true)
        );

        CREATE TABLE categories (
          id SERIAL PRIMARY KEY,
          category_name VARCHAR(255) NOT NULL UNIQUE
        );

        CREATE TABLE posts (
          id SERIAL PRIMARY KEY,
          item_name VARCHAR(255) NOT NULL,
          description VARCHAR(255) NOT NULL,
          price INTEGER,
          contact_type INTEGER,
          contact VARCHAR(255) NOT NULL,
          backup_contact_type INTEGER,
          backup_contact VARCHAR(255) NOT NULL,
          report_count INTEGER,
          location VARCHAR(255),
          state INTEGER,
          image BYTEA NOT NULL,
          user_id INTEGER REFERENCES users(id),
          category_id INTEGER REFERENCES categories(id) 
          );

          CREATE TABLE emails (
            id SERIAL PRIMARY KEY,
            email varchar(255) NOT NULL UNIQUE
          );
        

        
      `);

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!", error);
    throw error;
  }
}

async function createInitialUsers() {
  console.log("Starting to create users...");
  try {
    const ownerToCreate = [
      { email: "gebhardcole@gmail.com", username: "cole", password: OWNER_PASSWORD, is_owner: true, is_admin: true },
    ];

    const usersToCreate = [
      { email: "john@example.com", username: "john_doe", password: "Password123!", is_owner: true, is_admin: true },
    ];

    const createdUsers = [];

    for (const user of ownerToCreate) {
      const createdOwner = await createOwner(user);
      createdUsers.push(createdOwner)
    }

    for (const user of usersToCreate) {
      const createdUser = await createUser(user);
      createdUsers.push(createdUser);
    }

    console.log("Users created:");
    console.log(createdUsers);
    console.log("Finished creating users!");

  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    await dropTables();
    await createTables();
    await createInitialUsers();
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error
  } finally {
    await client.end();
  }
}

module.exports = {
  rebuildDB,
}
