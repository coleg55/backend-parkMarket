const client = require('./client')

async function createPost({ item_name, description, price, contact_type, contact, backup_contact_type, backup_contact, report_count, location, state, image, user_id, category_id, date_created, isHeadline, isFeatured }) {
    try {
      // Check if image data is in the correct format
      if (!image.startsWith('data:image/')) {
        throw new Error('Invalid image data format');
      }
  
      // Extract image format and base64 data
      const imageParts = image.split(';base64,');
      const imageData = Buffer.from(imageParts[1], 'base64');
  
      // Insert the post into the database
      const { rows: [post] } = await client.query(`
        INSERT INTO posts (item_name, description, price, contact_type, contact, backup_contact_type, backup_contact, report_count, location, state, image, user_id, category_id, date_created, isHeadline, isFeatured)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *;
      `, [item_name, description, price, contact_type, contact, backup_contact_type, backup_contact, report_count, location, state, imageData, user_id, category_id, date_created, isHeadline, isFeatured]);
  
      console.log(post);
  
      return post;
    } catch (error) {
        console.error('Error creating post:', error.message);
        throw new Error('Failed to create post');
    }
  }
  

async function getAllPosts() {
  try {
    //Gets a collection of all posts
    //Joins as
    const query = `
      SELECT posts.*, categories.name AS category_name
      FROM posts
      INNER JOIN categories ON posts.category_id = categories.id
      ORDER BY date_created DESC;
    `;
    const { rows } = await client.query(query);
    return rows;
  } catch (error) {
    console.error('Error getting post', error)
    throw new Error('Failed to retrieve posts');
  }
}



async function getPostById(id) {
  try {
    const { rows } = await client.query(`
        SELECT * 
        FROM posts
        WHERE id=$1;
        `, [id])

    if (!rows) {
      throw new Error(`Post with id:${id} not found`)
    }

    return rows
  } catch (error) {
    console.error('Error getting post', error)
    throw new Error('Failed to get post by id')
  }
}

async function updatePost(id, updates, user_id, is_admin) {
  try {
    // Check if the post exists
    const existingPost = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);

    if (existingPost.rows.length === 0) {
      throw new Error(`No post found with ID:${id}`);
    }

    const post = existingPost.rows[0];

    // Check user authorization
    if (user_id !== post.user_id && !is_admin) {
      throw new Error('Forbidden');
    }

    // Clear isHeadline flag for all other posts if isHeadline is being updated
    if (updates.isHeadline) {
      await pool.query('UPDATE posts SET "isHeadline" = FALSE WHERE id != $1', [id]);
    }

    // Update post
    const { rows: [updatedPost] } = await pool.query(
      'UPDATE posts SET title = $1, content = $2, categoryId = $3, isHeadline = $4, image = $5 WHERE id = $6 RETURNING *',
      [updates.title, updates.content, updates.categoryId, updates.isHeadline, updates.image, id]
    );

    return updatedPost;
  } catch (error) {
    throw error;
  }
}



async function deletePost(id, userId, isAdmin) {
  const { rows: [post] } = await client.query(`
    SELECT user_id FROM posts WHERE id=$1
  `, [id]);

  if (post.user_id !== userId && !isAdmin) {
    throw new Error('Only the post owner or an administrator can delete this post.');
  }

  const { rows: [deletedPost] } = await client.query(`
    DELETE FROM posts
    WHERE id=$1
    RETURNING *;
  `, [id]);

  return deletedPost;
}

async function getPostsByCategoryId( categoryId ) {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM posts
      WHERE "categoryId" = $1
      `,
      [categoryId]
    );

    return rows;
  } catch (error) {
    throw error;
  }
}


module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  subscribeUser,
  getAllSubscribedEmails,
  unsubscribeEmail,
  getPostsByCategoryId
};
