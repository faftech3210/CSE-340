// Import model functions
import { getAllCategories, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

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

// Export controller functions
export { showCategoriesPage, showCategoryDetailsPage };