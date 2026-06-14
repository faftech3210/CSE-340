CREATE TABLE organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organizations (name, description, contact_email, logo_filename)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);

CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(100) NOT NULL,
    project_date DATE NOT NULL,

    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organizations(organization_id)
        ON DELETE CASCADE
);

INSERT INTO projects (
    organization_id,
    title,
    description,
    location,
    project_date
)
VALUES

-- BrightFuture Builders Projects
(
    1,
    'Community Playground Renovation',
    'Renovating playground equipment and improving safety features for children.',
    'Lagos Community Park',
    '2026-06-10'
),
(
    1,
    'Affordable Housing Repair Initiative',
    'Repairing roofs, windows, and walls for low-income families.',
    'Ikeja, Lagos',
    '2026-06-18'
),
(
    1,
    'Public Library Expansion',
    'Constructing additional reading and study spaces for students.',
    'Surulere, Lagos',
    '2026-07-02'
),
(
    1,
    'Community Health Center Upgrade',
    'Improving accessibility and facilities at a local health center.',
    'Yaba, Lagos',
    '2026-07-15'
),
(
    1,
    'School Classroom Construction',
    'Building new classrooms for overcrowded primary schools.',
    'Badagry, Lagos',
    '2026-08-05'
),

-- GreenHarvest Growers Projects
(
    2,
    'Urban Rooftop Garden Program',
    'Creating rooftop vegetable gardens for sustainable food production.',
    'Victoria Island, Lagos',
    '2026-06-12'
),
(
    2,
    'Community Compost Training',
    'Teaching residents how to create and use organic compost effectively.',
    'Lekki, Lagos',
    '2026-06-22'
),
(
    2,
    'Neighborhood Greenhouse Project',
    'Building a greenhouse to support year-round vegetable farming.',
    'Ajah, Lagos',
    '2026-07-08'
),
(
    2,
    'School Farming Education Workshop',
    'Educating students about urban agriculture and sustainability.',
    'Ikorodu, Lagos',
    '2026-07-20'
),
(
    2,
    'City Tree and Crop Planting Day',
    'Organizing volunteers to plant trees and food crops in urban spaces.',
    'Epe, Lagos',
    '2026-08-01'
),

-- UnityServe Volunteers Projects
(
    3,
    'Local Food Bank Assistance',
    'Coordinating volunteers to package and distribute food supplies.',
    'Mushin, Lagos',
    '2026-06-14'
),
(
    3,
    'Charity Fundraising Walk',
    'Hosting a fundraising walk to support local nonprofit organizations.',
    'Lekki Conservation Area',
    '2026-06-28'
),
(
    3,
    'Senior Citizen Support Visit',
    'Providing companionship and assistance to elderly community members.',
    'Agege, Lagos',
    '2026-07-05'
),
(
    3,
    'Youth Mentorship Program',
    'Connecting volunteers with teenagers for educational mentorship.',
    'Festac Town, Lagos',
    '2026-07-18'
),
(
    3,
    'Community Donation Drive',
    'Collecting clothing, books, and supplies for families in need.',
    'Oshodi, Lagos',
    '2026-08-10'
);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE project_categories (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE,

    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);

INSERT INTO categories (name) VALUES
('Community Development'),
('Sustainability'),
('Education'),
('Healthcare'),
('Volunteer Services');

INSERT INTO project_categories (project_id, category_id) VALUES
(1, 1),
(1, 5),

(2, 1),

(3, 3),

(4, 4),

(5, 3),

(6, 2),

(7, 2),

(8, 3),

(9, 2),

(10, 2),

(11, 5),

(12, 5),

(13, 4),

(14, 3),

(15, 5);

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description) VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a test user
INSERT INTO users (name, email, password_hash, role_id) 
VALUES ('testuser', 'test@example.com', 'placeholder_hash', 1);

-- Join users and roles to see complete information
SELECT u.user_id, u.name, u.email, r.role_name, r.role_description
FROM users u
JOIN roles r ON u.role_id = r.role_id;

-- Delete the test user
DELETE FROM users WHERE email = 'test@example.com';

-- Create user_projects junction table with correct primary keys
CREATE TABLE user_projects (
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, project_id),
    CONSTRAINT fk_volunteer_user
        FOREIGN KEY (user_id) 
        REFERENCES users(user_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_volunteer_project
        FOREIGN KEY (project_id) 
        REFERENCES projects(project_id) 
        ON DELETE CASCADE
);
