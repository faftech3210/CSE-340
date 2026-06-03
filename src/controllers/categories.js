// Import model functions
import { 
    getAllCategories,  
    getCategoriesByProjectId, 
    updateCategoryAssignments, 
    getCategoryById,
    createCategory,
    updateCategory, 
    getProjectsByCategoryId 
} from '../models/categories.js';
import { body, validationResult } from 'express-validator';
import { getProjectDetails } from '../models/projects.js';

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required.')
        .isLength({ min: 3 }).withMessage('Category name must be at least 3 characters long.')
        .isLength({ max: 100 }).withMessage('Category name cannot exceed 100 characters.')
];

// Define controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

/* ***************************
 * Build category detail page
 * ************************** */
const showCategoryDetailsPage = async (req, res, next) => {
    const categoryId = parseInt(req.params.id)

    const category = await getCategoryById(categoryId)

    if (!category) {
        const error = new Error("Category not found")

        error.status = 404

        return next(error)
    }

    const projects =
        await getProjectsByCategoryId(categoryId)

    res.render("categoriesDetails", {
        title: category.name,
        category,
        projects
    })
}

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

/* ***************************
 * Render Create Category Form
 * ************************** */
const showCreateCategoryForm = async (req, res) => {
    const title = 'Create New Category';
    res.render('new-category', { 
        title, errors: null, 
        formData: { name: '' } 
    });
};

/* ***************************
 * Process Create Category Form
 * ************************** */
const processCreateCategoryForm = async (req, res) => {
    // Check for validation errors FIRST
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-category');
    }

    const { name } = req.body;

    try {
        await createCategory(name);
        req.flash('success', 'New category created successfully!');
        res.redirect('/categories');
    } catch (error) {
        console.error('Error creating new category:', error);
        req.flash('error', 'There was an error creating the category.');
        res.redirect('/new-category');
    }
};

/* ***************************
 * Render Edit Category Form
 * ************************** */
const showEditCategoryForm = async (req, res, next) => {
    const categoryId = parseInt(req.params.id);

    try {
        const category = await getCategoryById(categoryId);

        if (!category) {
            const error = new Error("Category not found");
            error.status = 404;
            return next(error);
        }

        const title = `Edit Category: ${category.name}`;
        
        res.render('edit-category', { 
            title, 
            category,
            errors: null
        });
    } catch (error) {
        console.error("Error in showEditCategoryForm:", error);
        req.flash('error', 'Error loading the edit form.');
        res.redirect('/categories');
    }
};

/* ***************************
 * Process Edit Category Form
 * ************************** */
const processEditCategoryForm = async (req, res) => {
    const categoryId = parseInt(req.params.id);

    // Check for validation errors FIRST
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-category/${categoryId}`);
    }

    const { name } = req.body;

    try {
        await updateCategory(categoryId, name);
        req.flash('success', 'Category updated successfully!');
        res.redirect('/categories');
    } catch (error) {
        console.error("Error in processEditCategoryForm:", error);
        req.flash('error', 'Failed to update category.');
        res.redirect(`/edit-category/${categoryId}`);
    }
};

// Export controller functions
export { 
    showCategoriesPage, 
    processAssignCategoriesForm,
    showAssignCategoriesForm,
    showCategoryDetailsPage,
    categoryValidation, 
    showCreateCategoryForm,
    processCreateCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
};