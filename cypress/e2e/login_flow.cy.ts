// in cypress/e2e/login_flow.cy.ts

describe('Full User Journey', () => {
  it('should allow a user to log in and see the dashboard data', () => {
    // Step 1: Visit the login page
    cy.visit('http://localhost:3000');

    // Step 2: Fill in the form
    // Find the input for username and type into it
    cy.get('input[id="username"]').type('researcher1');
    // Find the input for password and type into it
    cy.get('input[id="password"]').type('testpassword');

    // Step 3: Click the login button
    cy.get('button[type="submit"]').click();

    // Step 4: Verify we are on the dashboard
    // The URL should now include '/dashboard'
    cy.url().should('include', '/dashboard');

    // The page should contain the title "Researcher Dashboard"
    cy.contains('h1', 'Researcher Dashboard');

    // Step 5: Verify the data table is visible
    // The table should have a header for "Name (District)"
    cy.get('table').should('be.visible');
    cy.get('table thead').contains('th', 'Name (District)');
  });
});