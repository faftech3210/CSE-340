// Import any needed model functions (none are needed for the error pages, so this is empty)
    
// Define any controller functions
const show404Page = (req, res) => {
    res.status(404).render('404', {
        title: '404 - Page Not Found'
    });
};

// Render 500 page
const show500Page = (req, res) => {
    res.status(500).render('500', {
        title: '500 - Server Error'
    });
};
// Test route for 500 errors
const testErrorPage = (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
};

// controller functions
export { testErrorPage, show500Page, show404Page };