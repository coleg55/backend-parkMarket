const client = require('./client');
const SALT_COUNT = 10;
const bcrypt = require('bcrypt');

async function createOwner({ username, email, password, is_owner, is_admin}) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    // Validate password requirements
    if (!passwordRegex.test(password)) {
        let errorMessages = [];
        if (password.length < 8) {
            errorMessages.push("Password must be at least 8 characters long");
        }
        if (!/\d/.test(password)) {
            errorMessages.push("Password must contain at least one digit");
        }
        if (!/[a-z]/.test(password)) {
            errorMessages.push("Password must contain at least one lowercase letter");
        }
        if (!/[A-Z]/.test(password)) {
            errorMessages.push("Password must contain at least one uppercase letter");
        }
        throw new Error(errorMessages.join(", "));
    }

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

        const { rows: [user] } = await client.query(`
        INSERT INTO users(username, email, password, is_owner, is_admin)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `, [username, email, hashedPassword, is_owner, is_admin]);

        return user;
    } catch (error) {
        if (error.code === '2555') {
            throw new Error('Username or email already exists')
        } else {
            console.error('Failed to create user:', error);
            throw new Error('Failed to create user');
        }
    };
};

async function createUser({ username, email, password}) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    // Validate password requirements
    if (!passwordRegex.test(password)) {
        let errorMessages = [];
        if (password.length < 8) {
            errorMessages.push("Password must be at least 8 characters long");
        }
        if (!/\d/.test(password)) {
            errorMessages.push("Password must contain at least one digit");
        }
        if (!/[a-z]/.test(password)) {
            errorMessages.push("Password must contain at least one lowercase letter");
        }
        if (!/[A-Z]/.test(password)) {
            errorMessages.push("Password must contain at least one uppercase letter");
        }
        throw new Error(errorMessages.join(", "));
    }

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

        const { rows: [user] } = await client.query(`
        INSERT INTO users(username, email, password)
        VALUES ($1, $2, $3)
        RETURNING *;
    `, [username, email, hashedPassword]);


        return user;
    } catch (error) {
        if (error.code === '2555') {
            throw new Error('Username or email already exists')
        } else {
            console.error('Failed to create user:', error);
            throw new Error('Failed to create user');
        }
    };
};

async function logInUser({ username, email, password, email_verified, last_login }) {
    try {
        // Hash the entered password before using it in the query
        const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
        console.log('Password', hashedPassword);

        const { rows: [user] } = await client.query(`
            SELECT *
            FROM users
            WHERE (username = $1 OR email = $2)
        `, [username, email]);

        if (!user) {
            console.log('User not found');
            return null; // User not found
        }

        // Compare the hashed password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            console.log('Incorrect password');
            return null; // Incorrect password
        }

        console.log('User logged in:', user);
        return user;
    } catch (error) {
        console.error(error);
        throw error; // Rethrow the error for proper error handling
    }
}

async function getAllUsers() {
    try {
        const { rows } = await client.query(`
        SELECT *
        FROM users`);

        if (rows.length === 0) {
            throw new Error('No users found')
        }

        return rows
    } catch (error) {
        throw new Error('Cannot get all users')
    }
}

async function getUserById(id) {
    try {
        const { rows } = await client.query(`
        SELECT * 
        FROM users
        WHERE id=$1
      `, [id]);

        if (rows.length === 0) {
            throw new Error(`No user found with id ${id}`);
        }

        const user = rows[0];
        delete user.password;
        return user;
    } catch (error) {
        throw new Error('Cannot get user by ID');
    }
}

async function getUserByUsername(username) {
    try {
        const { rows } = await client.query(`
        SELECT * 
        FROM users
        WHERE username=$1
      `, [username]);

        const user = rows.length ? rows[0] : null;

        return user;
    } catch (error) {
        throw new Error('Cannot get user by Username');
    }
}


async function getUserByEmail(email) {
    try {
        const { rows } = await client.query(`
        SELECT * 
        FROM users
        WHERE email=$1
      `, [email]);

        if (rows.length === 0) {
            throw new Error(`No user found with email: ${email}`);
        }

        const user = rows[0];
        return user;
    } catch (error) {
        throw new Error('Cannot get user by email');
    }
}

async function updateUser(id) {
    
}

module.exports = {
    createOwner,
    createUser,
    logInUser
};
