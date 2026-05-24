// Import model functions
import { getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails,
    getCategoriesByProjectId,
    getProjectsByCategoryId } from '../models/projects.js';
import {
    getOrganizationByProjectId
} from "../models/organizations.js";

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define controller functions
const showProjectsPage = async (req, res) => {

    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS)

    const title = 'Upcoming Service Projects'

    res.render('projects', {
        title,
        projects
    })
}


/* ***************************
 * Build project detail page
 * ************************** */
const showProjectDetailsPage = async (req, res, next) => {
    const projectId = parseInt(req.params.id)
    const title = 'Service Project Details'

    const project =
        await getProjectDetails(projectId)

    if (!project) {
        const error = new Error("Project not found")

        error.status = 404

        return next(error)
    }

    const organization =
        await getOrganizationByProjectId(projectId)

    const categories =
        await getCategoriesByProjectId(projectId)

    res.render("project", {
        title,
        project,
        organization,
        categories
    })
}

// Export controller functions
export { showProjectsPage, showProjectDetailsPage };