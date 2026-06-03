import express from 'express';

import { showHomePage } from './controllers/index.js';
import { 
    showProjectsPage, 
    showProjectDetailsPage,
    processNewProjectForm, 
    showNewProjectForm, 
    projectValidation, 
    showEditProjectForm, 
    processEditProjectForm, 
} from './controllers/projects.js';
import { 
    showCategoriesPage, 
    showAssignCategoriesForm, 
    processAssignCategoriesForm, 
    showCategoryDetailsPage,
    showCreateCategoryForm,
    processCreateCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation 
} from './controllers/categories.js';
import { testErrorPage, show500Page, show404Page } from './controllers/errors.js';
import { showOrganizationsPage, processEditOrganizationForm, showEditOrganizationForm, showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm, organizationValidation } from './controllers/organizations.js';

const router = express.Router();

// Route for pages rendering
router.get("/", showHomePage)

router.get("/organizations", showOrganizationsPage)
router.get("/organization/:id", showOrganizationDetailsPage)
// Route to handle the edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);
// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);
// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);


router.get("/projects", showProjectsPage)

// Route to handle new project form submission
router.post('/new-project', projectValidation, processNewProjectForm);
router.get("/project/:id", showProjectDetailsPage)

// Route for new project page
router.get('/new-project', showNewProjectForm);
// Ensure you add showEditProjectForm and processEditProjectForm to your imports at the top!

// GET Route to display the form with current values filled out
router.get('/edit-project/:id', showEditProjectForm);

// POST Route to capture data updates
router.post('/edit-project/:id', processEditProjectForm);


router.get("/categories", showCategoriesPage)
router.get("/categories/:id", showCategoryDetailsPage)

// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

// New Category Creation Routes
router.get('/new-category', showCreateCategoryForm);
router.post('/new-category', categoryValidation, processCreateCategoryForm);

// Edit Existing Category Routes
router.get('/edit-category/:id', showEditCategoryForm);
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);


// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;