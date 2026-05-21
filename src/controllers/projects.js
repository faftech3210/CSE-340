// Import model functions
import { getAllProjects, getUpcomingProjects, getProjectDetails } from '../models/projects.js';

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

const showProjectDetailsPage = async (req, res) => {

    const id = req.params.id

    const project = await getProjectDetails(id)

    const title = project.title

    if (!project) {
        return res.status(404).send('Project not found')
    }

    res.render('project', {
        title,
        project
    })
}

// Export controller functions
export { showProjectsPage, showProjectDetailsPage };