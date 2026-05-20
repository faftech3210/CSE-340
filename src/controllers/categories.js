// Import model functions
import { getAllCategories } from '../models/categories.js';

// Define controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};  

// Export controller functions
export { showCategoriesPage };