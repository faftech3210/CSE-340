import db from "./db.js"

/* ***************************
 * Get all projects
 * ************************** */
const getAllProjects = async () => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            o.name AS organization_name
        FROM public.projects p
        JOIN public.organizations o
            ON p.organization_id = o.organization_id
        ORDER BY o.name;
    `

    const result = await db.query(query)

    return result.rows
}

/* ***************************
 * Get projects by organization ID
 * ************************** */
const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            project_date
        FROM public.projects
        WHERE organization_id = $1
        ORDER BY project_date;
    `

    const result = await db.query(query, [organizationId])

    return result.rows
}

/* ***************************
 * Get upcoming projects
 * ************************** */
const getUpcomingProjects = async (numberOfProjects) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            p.organization_id,
            o.name AS organization_name
        FROM public.projects p
        JOIN public.organizations o
            ON p.organization_id = o.organization_id
        WHERE p.project_date >= CURRENT_DATE
        ORDER BY p.project_date ASC
        LIMIT $1;
    `

    const result = await db.query(query, [numberOfProjects])

    return result.rows
}

/* ***************************
 * Get project details
 * ************************** */
const getProjectDetails = async (id) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            p.organization_id,
            o.name AS organization_name
        FROM public.projects p
        JOIN public.organizations o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `

    const result = await db.query(query, [id])

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

    const result = await db.query(query, [projectId])

    return result.rows
}

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO projects (title, description, location, project_date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
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
            p.project_date,
            o.name AS organization_name
        FROM public.projects p
        JOIN public.project_categories pc
            ON p.project_id = pc.project_id
        JOIN public.organizations o
            ON p.organization_id = o.organization_id
        WHERE pc.category_id = $1
        ORDER BY p.project_date;
    `

    const result = await db.query(query, [categoryId])

    return result.rows
}

/**
 * Update an existing service project in the database
 */
const updateProject = async (projectId, title, description, location, project_date, organizationId) => {
    const sql = `
        UPDATE projects 
        SET title = $1, 
            description = $2, 
            location = $3, 
            project_date = $4, 
            organization_id = $5 
        WHERE project_id = $6
        RETURNING project_id;
    `;
    
    try {
        const result = await db.query(sql, [title, description, location, project_date, organizationId, projectId]);
        
        if (result.rows.length === 0) {
            throw new Error(`Update failed: Project ID ${projectId} not found.`);
        }
        
        return result.rows[0].project_id;
    } catch (error) {
        console.error("Database error in updateProject:", error);
        throw error;
    }
};

// Check if a user is already volunteering for a specific project
const isUserVolunteering = async (userId, projectId) => {
    const query = `
        SELECT 1 
        FROM public.user_projects 
        WHERE user_id = $1 AND project_id = $2;
    `

    const result = await db.query(query, [userId, projectId])

    return result.rowCount > 0;
}

// Add a volunteer record to a project
const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO public.user_projects (user_id, project_id) 
        VALUES ($1, $2) 
        ON CONFLICT (user_id, project_id) DO NOTHING;
    `

    const result = await db.query(query, [userId, projectId])

    return result
}

// Remove a volunteer record from a project
const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM public.user_projects 
        WHERE user_id = $1 AND project_id = $2;
    `

    const result = await db.query(query, [userId, projectId])

    return result
}

// Retrieve all projects a specific user has signed up for
const getProjectsByUser = async (userId) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.project_date, o.name AS organization_name 
        FROM public.projects p
        JOIN public.user_projects up 
            ON p.project_id = up.project_id
        JOIN public.organizations o 
            ON p.organization_id = o.organization_id
        WHERE up.user_id = $1
        ORDER BY p.project_date ASC;
    `

    const result = await db.query(query, [userId])

    return result.rows
}

export {
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    createProject,
    updateProject,
    getProjectsByUser,
    removeVolunteer,
    addVolunteer,
    isUserVolunteering

}