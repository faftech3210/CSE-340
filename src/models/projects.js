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

export {
    getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails,
    getCategoriesByProjectId,
    getProjectsByCategoryId
}