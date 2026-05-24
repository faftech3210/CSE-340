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
export {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId
}