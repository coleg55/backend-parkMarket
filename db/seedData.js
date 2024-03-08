const { createUser, createOwner } = require('./users');
const { createCategory, createSize } = require('./categories')
const { createPost } = require('./posts')
require('dotenv').config();

const OWNER_PASSWORD = process.env.OWNER_PASSWORD

const client = require("./client")

async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    await client.query(`
    DROP TABLE IF EXISTS emails;
    DROP TABLE IF EXISTS posts;
    DROP TABLE IF EXISTS sizes;
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
          date_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          is_owner BOOLEAN DEFAULT false,
          is_admin BOOLEAN DEFAULT false
          CONSTRAINT is_admin_when_owner CHECK (is_owner = false OR is_admin = true)
        );

        CREATE TABLE categories (
          id SERIAL PRIMARY KEY,
          category_name VARCHAR(255) NOT NULL UNIQUE
        );

        CREATE TABLE sizes (
          id SERIAL PRIMARY KEY,
          category_id INTEGER REFERENCES categories(id),
          size_name VARCHAR(255)
        );

        CREATE TABLE posts (
          id SERIAL PRIMARY KEY,
          item_name VARCHAR(255) NOT NULL,
          description VARCHAR(255) NOT NULL,
          price INTEGER NOT NULL,
          date_created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          contact_type VARCHAR(255) NOT NULL,
          contact VARCHAR(255) NOT NULL,
          backup_contact_type VARCHAR(255),
          backup_contact VARCHAR(255),
          report_count INTEGER,
          location VARCHAR(255),
          state VARCHAR(255) NOT NULL,
          image BYTEA NOT NULL,
          user_id INTEGER REFERENCES users(id),
          category_id INTEGER REFERENCES categories(id),
          size_id INTEGER REFERENCES sizes(id)
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

async function createInitialCategories() {
  console.log("Starting to create categories...");
  try {
    const categoriesToCreate = [
      { category_name: "Skis" },
      { category_name: "Bindings" },
      { category_name: "Tops" },
      { category_name: "Bottoms" },
      { category_name: "Boots" },
      { category_name: "Other" },
      // Add more categories as needed
    ];

    const createdCategories = [];

    for (const category of categoriesToCreate) {
      const createdCategory = await createCategory(category);
      createdCategories.push(createdCategory);
    }

    console.log("Categories created:");
    console.log(createdCategories);
    console.log("Finished creating categories!");

  } catch (error) {
    console.error("Error creating categories!");
    throw error;
  }
}

async function createInitialSizes() {
  console.log("Starting to create sizes...");
  try {
    const sizesToCreate = [
      //Skis Category
      { category_id: 1, size_name: "<160" },
      { category_id: 1, size_name: "161-165" },
      { category_id: 1, size_name: "165-170" },
      { category_id: 1, size_name: "171-175" },
      { category_id: 1, size_name: "176-180" },
      { category_id: 1, size_name: "181-185" },
      { category_id: 1, size_name: "186-190" },
      { category_id: 1, size_name: "190<" },

      //Bindings Category
      { category_id: 2, size_name: "<90" },
      { category_id: 2, size_name: "91-100" },
      { category_id: 2, size_name: "101-110" },
      { category_id: 2, size_name: "111-120" },
      { category_id: 2, size_name: "121<" },

      //Tops Category
      { category_id: 3, size_name: "S" },
      { category_id: 3, size_name: "M" },
      { category_id: 3, size_name: "L" },
      { category_id: 3, size_name: "XL" },
      { category_id: 3, size_name: "XXL" },
      { category_id: 3, size_name: "3XL<" },

      //Bottoms Category
      { category_id: 4, size_name: "S" },
      { category_id: 4, size_name: "M" },
      { category_id: 4, size_name: "L" },
      { category_id: 4, size_name: "XL" },
      { category_id: 4, size_name: "XXL" },
      { category_id: 4, size_name: "3XL<" },

      // Add more sizes or categories as needed
    ];

    const CreatedSizes = [];

    for (const size of sizesToCreate) {
      const createdSize = await createSize(size);
      CreatedSizes.push(createdSize);
    }

    console.log("Sizes created:");
    console.log(CreatedSizes);
    console.log("Finished creating sizes!");

  } catch (error) {
    console.error("Error creating sizes!");
    throw error;
  }
}

async function createInitialPosts() {
  console.log("Starting to create posts...");
  try {
    const postsToCreate = [
      {
        item_name: "Ski Equipment",
        description: "High-quality ski gear for sale.",
        price: 200,
        contact_type: "email",
        contact: "example@gmail.com",
        backup_contact_type: "phone",
        backup_contact: "123-456-7890",
        report_count: 0,
        location: "Mountain Town",
        state: "CA",
        image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...",
        user_id: 1, // Replace with the appropriate user_id
        category_id: 1, // Replace with the appropriate category_id
        date_created: new Date(),
      },
      // Add more posts as needed
    ];

    const createdPosts = [];

    for (const post of postsToCreate) {
      const createdPost = await createPost(post);
      createdPosts.push(createdPost);
    }

    console.log("Posts created:");
    console.log(createdPosts);
    console.log("Finished creating posts!");

  } catch (error) {
    console.error("Error creating posts!");
    throw error;
  }
}
async function rebuildDB() {
  try {
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialCategories();
    await createInitialSizes();
    await createInitialPosts();
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
