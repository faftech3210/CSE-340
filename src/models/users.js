import db from './db.js'
import bcrypt from 'bcrypt';

const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const queryParams = [name, email, passwordHash, default_role];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
    const query = `
        SELECT 
            u.user_id, 
            u.name,        -- 👈 ADD THIS LINE RIGHT HERE!
            u.email, 
            u.password_hash, 
            r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
    const queryParams = [email];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }
    
    return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

/**
 * Authenticates a user by their email and password.
 * @param {string} email - The user's login email address.
 * @param {string} password - The plain-text password provided.
 * @returns {Promise<Object|null>} The authenticated user object (without password_hash) or null.
 */
const authenticateUser = async (email, password) => {
    try {
        // 1. Fetch the user by their email address
        const user = await findUserByEmail(email);
        
        // 2. If no user is found, return null safely
        if (!user) {
            return null;
        }
        
        // 3. Verify if the raw password matches the stored hash
        const isPasswordCorrect = await verifyPassword(password, user.password_hash);
        
        // 4. If correct, strip the sensitive data and return the user profile
        if (isPasswordCorrect) {
            delete user.password_hash; 
            return user;
        }
        
        // 5. If password verification fails, return null
        return null;
        
    } catch (error) {
        console.error("Authentication process encountered an error:", error);
        throw error;
    }
};

export { createUser, authenticateUser };