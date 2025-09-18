// COD Management Frontend E2E Tests
describe('COD Management', () => {
  beforeEach(() => {
    // Setup: Visit the admin interface and navigate to COD tab
    cy.visit('/admin');
    cy.contains('COD').click();
  });

  it('should display COD management dashboard', () => {
    // Check that the COD management dashboard is displayed
    cy.contains('Cash on Delivery Management').should('be.visible');
    cy.contains('Add COD Payment').should('be.visible');
    
    // Check that summary cards are displayed
    cy.contains('Total Payments').should('be.visible');
    cy.contains('Total Amount').should('be.visible');
    cy.contains('Collected').should('be.visible');
    cy.contains('Reconciled').should('be.visible');
  });

  it('should create a new COD payment', () => {
    // Click the "Add COD Payment" button
    cy.contains('Add COD Payment').click();
    
    // Fill in the form
    cy.get('input[name="shipment_id"]').type('123e4567-e89b-12d3-a456-426614174000');
    cy.get('input[name="driver_id"]').type('123e4567-e89b-12d3-a456-426614174001');
    cy.get('input[name="amount"]').type('100.50');
    cy.get('textarea[name="notes"]').type('Test COD payment');
    
    // Submit the form
    cy.contains('Create').click();
    
    // Check that the payment was created
    cy.contains('123e4567-e89b-12d3-a456-426614174000').should('be.visible');
    cy.contains('EGP 100.50').should('be.visible');
  });

  it('should view COD payment details', () => {
    // Click on the first COD payment in the table
    cy.get('table tbody tr').first().click();
    
    // Check that the payment details are displayed
    cy.contains('View COD Payment').should('be.visible');
    cy.contains('Status').should('be.visible');
    cy.contains('Created At').should('be.visible');
  });

  it('should update COD payment status', () => {
    // Find a pending payment and click the "Collect" button
    cy.get('table tbody tr').contains('pending').parent().parent().within(() => {
      cy.contains('Collect').click();
    });
    
    // Confirm the status update
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Status updated successfully');
    });
    
    // Check that the status was updated
    cy.get('table tbody tr').contains('collected').should('be.visible');
  });

  it('should filter COD payments by status', () => {
    // Select "Collected" from the status filter dropdown
    cy.get('select').select('collected');
    
    // Check that only collected payments are displayed
    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).contains('collected').should('be.visible');
    });
  });

  it('should display COD summary statistics', () => {
    // Check that summary statistics are displayed
    cy.contains('Total Payments').parent().parent().contains(/\d+/).should('be.visible');
    cy.contains('Total Amount').parent().parent().contains(/EGP \d+\.\d{2}/).should('be.visible');
    cy.contains('Collected').parent().parent().contains(/EGP \d+\.\d{2}/).should('be.visible');
    cy.contains('Reconciled').parent().parent().contains(/EGP \d+\.\d{2}/).should('be.visible');
  });
});

// Driver COD Collection E2E Tests
describe('Driver COD Collection', () => {
  beforeEach(() => {
    // Setup: Login as a driver and navigate to the dashboard
    cy.visit('/driver/login');
    cy.get('input[name="phone"]').type('1234567890');
    cy.contains('Login').click();
    cy.url().should('include', '/driver/dashboard');
  });

  it('should display COD collection interface', () => {
    // Navigate to the COD Collection tab
    cy.contains('COD Collection').click();
    
    // Check that the COD collection interface is displayed
    cy.contains('Cash on Delivery Collection').should('be.visible');
    cy.contains('No COD payments assigned to you').should('be.visible');
  });

  it('should collect a COD payment', () => {
    // Assuming there are COD payments assigned to the driver
    cy.get('ul li').first().within(() => {
      cy.contains('Collect').click();
    });
    
    // Fill in the collection form
    cy.get('input[type="number"]').clear().type('100.50');
    cy.get('textarea').type('Collected from customer');
    
    // Confirm the collection
    cy.contains('Confirm Collection').click();
    
    // Check that the payment status was updated
    cy.get('ul li').first().contains('Collected').should('be.visible');
  });
});

// COD Reconciliation E2E Tests
describe('COD Reconciliation', () => {
  beforeEach(() => {
    // Setup: Visit the admin interface and navigate to Reconciliation tab
    cy.visit('/admin');
    cy.contains('Reconciliation').click();
  });

  it('should display COD reconciliation dashboard', () => {
    // Check that the reconciliation dashboard is displayed
    cy.contains('COD Reconciliation').should('be.visible');
    cy.contains('Bulk Reconcile All').should('be.visible');
    
    // Check that summary cards are displayed
    cy.contains('Total Collected').should('be.visible');
    cy.contains('Pending Collection').should('be.visible');
    cy.contains('Reconciled').should('be.visible');
    cy.contains('Total Payments').should('be.visible');
  });

  it('should reconcile a COD payment', () => {
    // Find a collected payment and click the "Reconcile" button
    cy.get('table tbody tr').contains('collected').parent().parent().within(() => {
      cy.contains('Reconcile').click();
    });
    
    // Confirm the reconciliation
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Payment reconciled successfully');
    });
    
    // Check that the payment status was updated
    cy.get('table tbody tr').contains('reconciled').should('be.visible');
  });

  it('should bulk reconcile all COD payments', () => {
    // Click the "Bulk Reconcile All" button
    cy.contains('Bulk Reconcile All').click();
    
    // Confirm the bulk reconciliation
    cy.on('window:alert', (str) => {
      expect(str).to.equal('All payments reconciled successfully');
    });
    
    // Check that all payments were reconciled
    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).contains('reconciled').should('be.visible');
    });
  });

  it('should filter COD payments by status', () => {
    // Select "Reconciled" from the status filter dropdown
    cy.get('select').first().select('reconciled');
    
    // Check that only reconciled payments are displayed
    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).contains('reconciled').should('be.visible');
    });
  });

  it('should search for COD payments', () => {
    // Enter a search term
    cy.get('input[placeholder="Search"]').type('TRK001');
    
    // Check that only matching payments are displayed
    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).contains('TRK001').should('be.visible');
    });
  });
});