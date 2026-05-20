// Import model functions
import { getAllOrganizations } from '../models/organizations.js';

// Define Scontroller functions
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

// Export controller functions
export { showOrganizationsPage };