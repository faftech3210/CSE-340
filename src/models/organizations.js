import db from './db.js'

const getAllOrganizations = async() => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
      FROM public.Organizations;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getOrganizationDetails = async (organizationId) => {
      const query = `
      SELECT
        organization_id,
        name,
        description,
        contact_email,
        logo_filename
      FROM organizations
      WHERE organization_id = $1;
    `;

      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      // Return the first row of the result set, or null if no rows are found
      return result.rows.length > 0 ? result.rows[0] : null;
};

/* ***************************
 * Get organization by project ID
 * ************************** */
const getOrganizationByProjectId = async (projectId) => {
    const query = `
        SELECT
            o.organization_id,
            o.name,
            o.description,
            o.contact_email,
            o.logo_filename
        FROM public.organizations o
        JOIN public.projects p
            ON o.organization_id = p.organization_id
        WHERE p.project_id = $1;
    `;

    const result = await db.query(query, [projectId]);

    return result.rows[0];
};

const updateOrganization = async (organizationId, name, description, contactEmail, logoFilename) => {
  const query = `
    UPDATE organizations
    SET name = $1, description = $2, contact_email = $3, logo_filename = $4
    WHERE organization_id = $5
    RETURNING organization_id;
  `;

  const queryParams = [name, description, contactEmail, logoFilename, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error('Organization not found');
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Updated organization with ID:', organizationId);
  }

  return result.rows[0].organization_id;
};

export { getAllOrganizations, getOrganizationDetails, getOrganizationByProjectId, updateOrganization } 