import db from './db.js'

const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM public.categories
        ORDER BY name;
    `;

    const result = await db.query(query);

    return result.rows;
}

/* ***************************
 * Get category by ID
 * ************************** */
const getCategoryById = async (categoryId) => {
    const query = `
        SELECT category_id, name
        FROM public.categories
        WHERE category_id = $1;
    `

    const values = [categoryId]

    const result = await db.query(query, values)

    return result.rows[0]
}

/* ***************************
 * Get categories for a project
 * ************************** */
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM public.categories c
        JOIN public.project_categories pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `

    const values = [projectId]

    const result = await db.query(query, values)

    return result.rows
}

/* ***************************
 * Get projects for a category
 * ************************** */
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date
        FROM public.projects p
        JOIN public.project_categories pc
            ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.project_date;
    `

    const result = await db.query(query, [categoryId])

    return result.rows
}

const assignCategoryToProject = async(categoryId, projectId) => {
    const query = `
        INSERT INTO project_categories (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async(projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_categories
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}

/**
 * Insert a new service category into the database
 */
const createCategory = async (name) => {
    const sql = `
        INSERT INTO categories (name) 
        VALUES ($1) 
        RETURNING category_id;
    `;
    try {
        const result = await db.query(sql, [name]);
        return result.rows[0].category_id;
    } catch (error) {
        console.error("Database error in createCategory:", error);
        throw error;
    }
};

/**
 * Update an existing service category's name
 */
const updateCategory = async (categoryId, name) => {
    const sql = `
        UPDATE categories 
        SET name = $1 
        WHERE category_id = $2
        RETURNING category_id;
    `;
    try {
        const result = await db.query(sql, [name, categoryId]);
        if (result.rows.length === 0) {
            throw new Error(`Update failed: Category ID ${categoryId} not found.`);
        }
        return result.rows[0].category_id;
    } catch (error) {
        console.error("Database error in updateCategory:", error);
        throw error;
    }
};

export {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    updateCategoryAssignments,
    createCategory,updateCategory
}