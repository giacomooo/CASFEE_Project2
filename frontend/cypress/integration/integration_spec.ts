import { Parking } from 'src/app/models/Parking';

describe('Login Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
  });

  it('Logout if logged in', () => {
    if (cy.get('.bottom-nav').find('.action-settings').length > 0) {
      cy.get('.action-settings').click();
      cy.get('mat-nav-list').last().click();
    }
  });

  it('Login with credentials', () => {
    cy.get('.action-login').click();
    cy.get('#username').type('hans.keller@ost.ch', { force: true });
    cy.get('#password').type('Weiterbildung2021%', { force: true });
    cy.get('#kc-login').click();
    cy.get('.action-settings span').should('have.text', 'Hans Keller');
  });

  it('Clear old unsuccessful testings', () => {
    cy.get('.action-settings').click();
    cy.get('mat-nav-list').first().click();
    cy.get('.mat-line').first().click();
    cy.get('[formcontrolname="Location"]').invoke('val').should('not.be.empty');

    const parking = cy.get('[formcontrolname="Location"]').invoke('val').contains('[AAAAA_Cypress]');
    if (parking) {
      cy.get('.deleteButton').click();
      cy.get('#modal-action-button').click();
    }
  });
});

describe('Parking Administration Tests', () => {
  const newParking = new Parking(6441, '[AAAAA_Cypress] Seelisberg', 8.50, '[AAAAA_Cypress] Rütli', 5, 'a');
  const updatedParking = new Parking(6449, '[AAAAA_Cypress] Seelisberg Rütli', 99, '[AAAAA_Cypress] Rütli edited', 51, 'ax');

  beforeEach(() => {
    cy.visit('http://localhost:4200');

    cy.get('.action-settings').click();
    cy.get('mat-nav-list').first().click();
  });

  it('Create and read Parking', () => {
    cy.get('.addButton').click();
    cy.get('[formcontrolname="Street"]').type(newParking.Street);
    cy.get('[formcontrolname="StreetNo"]').type(newParking.StreetNo);
    cy.get('[formcontrolname="StreetNoSuffix"]').type(newParking.StreetNoSuffix);
    cy.get('[formcontrolname="ZIP"]').type(newParking.ZIP);
    cy.get('[formcontrolname="Location"]').type(newParking.Location);
    cy.get('[formcontrolname="PricePerHour"]').type(newParking.PricePerHour);
    cy.get('form').submit();

    cy.get('.mat-line').first().should('have.text', `${newParking.Street} ${newParking.StreetNo}${newParking.StreetNoSuffix}`);
    cy.get('.mat-line').eq(1).should('have.text', `${newParking.ZIP} ${newParking.Location}`);
  });

  it('Update Parking', () => {
    cy.get('.mat-line').first().click();
    cy.get('[formcontrolname="Location"]').invoke('val').should('not.be.empty');
    cy.get('[formcontrolname="Street"]').type(' edited');
    cy.get('[formcontrolname="StreetNo"]').type('1');
    cy.get('[formcontrolname="StreetNoSuffix"]').type('x');
    cy.get('[formcontrolname="ZIP"]').clear();
    cy.get('[formcontrolname="ZIP"]').type(6449);
    cy.get('[formcontrolname="Location"]').type(' Rütli');
    cy.get('[formcontrolname="PricePerHour"]').clear();
    cy.get('[formcontrolname="PricePerHour"]').type(99);
    cy.get('form').submit();

    cy.get('.mat-line').first().should('have.text', `${updatedParking.Street} ${updatedParking.StreetNo}${updatedParking.StreetNoSuffix}`);
    cy.get('.mat-line').eq(1).should('have.text', `${updatedParking.ZIP} ${updatedParking.Location}`);
  });

  it('Delete Parking', () => {
    cy.get('.mat-line').first().click();
    cy.get('[formcontrolname="Location"]').invoke('val').should('not.be.empty');
    cy.get('[formcontrolname="Location"]').invoke('val').should('eq', updatedParking.Location);
    cy.get('.deleteButton').click();
    cy.get('#modal-action-button').click();

    cy.get('.mat-line').first().should('not.have.text', `${updatedParking.Street} ${updatedParking.StreetNo}${updatedParking.StreetNoSuffix}`);
    cy.get('.mat-line').eq(1).should('not.have.text', `${updatedParking.ZIP} ${updatedParking.Location}`);
  });
});

// describe('Parking Tests', () => {
//   it('loads examples', () => {
//     expect(true).to.equal(true);
//   });
// });

// describe('Reservation Tests', () => {
//   it('loads examples', () => {
//     expect(true).to.equal(true);
//   });
// });
