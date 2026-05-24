import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage } from './controllers/categories.js';
import { testErrorPage, show500Page, show404Page } from './controllers/errors.js';
import { showOrganizationDetailsPage } from './controllers/organizations.js';

const router = express.Router();

// Route for pages rendering
router.get("/", showHomePage)

router.get("/organizations", showOrganizationsPage)

router.get("/organization/:id", showOrganizationDetailsPage)

router.get("/projects", showProjectsPage)

router.get("/project/:id", showProjectDetailsPage)

router.get("/categories", showCategoriesPage)

router.get("/categories/:id", showCategoryDetailsPage)

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;