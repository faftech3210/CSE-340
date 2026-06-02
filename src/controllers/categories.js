// Import model functions
import { 
    getAllCategories,  
    getCategoriesByProjectId, 
    updateCategoryAssignments, 
    getCategoryById, 
    getProjectsByCategoryId 
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';

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

// Export controller functions
export { 
    showCategoriesPage, 
    processAssignCategoriesForm,
    showAssignCategoriesForm,
    showCategoryDetailsPage };