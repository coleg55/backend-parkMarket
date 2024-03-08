const client = require('./client');


async function createCategory({ category_name }) {
  try {
    const { rows: [createdCategory] } = await client.query(`
        INSERT INTO categories (category_name)
        VALUES ($1)
        RETURNING *;
      `, [category_name]);

    return createdCategory;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create category');
  }
}

async function createSize({ category_id, size_name }) {
  try {
    const { rows: [createdSize] } = await client.query(`
        INSERT INTO sizes (category_id, size_name)
        VALUES ($1, $2)
        RETURNING *;
      `, [category_id, size_name]);

    return createdSize;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create category');
  }
}

async function getAllCategories() {
  try {
    const { rows } = await client.query(`
          SELECT * FROM categories;`)

    return rows;
  } catch (error) {
    throw new Error('Failed to get categories');
  }
}

async function getCategoryById(id) {
  try {
    const { rows: [category] } = await client.query(
      `
        SELECT * FROM categories
        WHERE id = $1
        `,
      [id]
    );

    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  } catch (error) {
    throw error;
  }
}


module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  createSize
}