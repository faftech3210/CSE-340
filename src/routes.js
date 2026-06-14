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
    handleUnvolunteer,
    handleVolunteer 
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
import { 
    testErrorPage, 
    show500Page, 
    show404Page 
} from './controllers/errors.js';
import { 
    showOrganizationsPage, 
    processEditOrganizationForm, 
    showEditOrganizationForm, 
    showOrganizationDetailsPage, 
    showNewOrganizationForm, 
    processNewOrganizationForm, 
    organizationValidation 
} from './controllers/organizations.js';
import { 
    showUserRegistrationForm, 
    processLoginForm,
    showLoginForm,
    processLogout, 
    processUserRegistrationForm,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage 
} from './controllers/users.js';

const router = express.Router();

// --- Public / General Routes ---
router.get("/", showHomePage);


// --- Organization Routes ---
router.get("/organizations", showOrganizationsPage);
router.get("/organization/:id", showOrganizationDetailsPage);

//  Admin Protected: Create New Organization
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);

//  Admin Protected: Edit Existing Organization
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);


// --- Project Routes ---
router.get("/projects", showProjectsPage);
router.get("/project/:id", showProjectDetailsPage);

//  Admin Protected: Create New Project
router.get('/new-project', requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);

//  Admin Protected: Edit Existing Project
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);

// Triggers form buttons
router.post('/projects/:id/volunteer', requireLogin, handleVolunteer)
router.post('/projects/:id/unvolunteer', requireLogin, handleUnvolunteer)


// --- Category Routes ---
router.get("/categories", showCategoriesPage);
router.get("/categories/:id", showCategoryDetailsPage);

//  Admin Protected: Assign Categories to Projects
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);

//  Admin Protected: Create New Category
router.get('/new-category', requireRole('admin'), showCreateCategoryForm);
router.post('/new-category', requireRole('admin'), categoryValidation, processCreateCategoryForm);

//  Admin Protected: Edit Existing Category
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);


// --- User Authentication Routes ---
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);
router.get('/users', requireLogin, (req, res, next) => {
    if (req.session.user.role_name !== 'admin') {
        req.flash('error', 'Access Denied: Only administrators may view the user registry.');
        return res.redirect('/dashboard'); // 👈 Redirects to dashboard specifically
    }
    next();
}, showUsersPage);

// --- Error Handling Routes ---
router.get('/test-error', testErrorPage);

export default router;