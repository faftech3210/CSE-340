// Import model functions
import { getAllProjects,
    getProjectsByOrganizationId,
    getUpcomingProjects,
    getProjectDetails,
    getCategoriesByProjectId,
    getProjectsByCategoryId,
    createProject, updateProject
 } from '../models/projects.js';
import { body, validationResult } from 'express-validator';
import { getOrganizationByProjectId, getAllOrganizations } from "../models/organizations.js";

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('project_date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

// Define controller functions
const showProjectsPage = async (req, res) => {

    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS)

    const title = 'Upcoming Service Projects'

    res.render('projects', {
        title,
        projects
    })
}

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}

const processNewProjectForm = async (req, res) => {
    //Check for validation errors FIRST
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the form immediately and stop execution
        return res.redirect('/new-project');
    }

    // Extract form data from req.body
    const { title, description, location, project_date, organizationId } = req.body;

    try {
        // Create the new project in the database only if data is valid
        const newProjectId = await createProject(title, description, location, project_date, organizationId);
        
        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
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

/**
 * Render the Edit Project Form populated with current data
 */
const showEditProjectForm = async (req, res, next) => {
    const projectId = parseInt(req.params.id);

    try {
        const project = await getProjectDetails(projectId);
        const organizations = await getAllOrganizations();

        if (!project) {
            const error = new Error("Project not found");
            error.status = 404;
            return next(error);
        }

        const title = `Edit Project: ${project.title}`;
        
        res.render('update-project', { 
            title, 
            project, 
            organizations 
        });
    } catch (error) {
        console.error("Error in showEditProjectForm:", error);
        req.flash('error', 'Error loading the edit form.');
        res.redirect('/projects');
    }
};

/**
 * Handle incoming form edits and commit them to the database
 */
const processEditProjectForm = async (req, res) => {
    const projectId = parseInt(req.params.id);
    const { title, description, location, project_date, organizationId } = req.body;

    try {
        await updateProject(projectId, title, description, location, project_date, organizationId);
        
        req.flash('success', 'Project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error("Error in processEditProjectForm:", error);
        req.flash('error', 'Failed to update project details.');
        res.redirect(`/edit-project/${projectId}`);
    }
};

// Export controller functions
export { 
showProjectsPage,   
showProjectDetailsPage, 
processNewProjectForm, 
showNewProjectForm, 
projectValidation,
showEditProjectForm,
processEditProjectForm
};