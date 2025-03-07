import { loadTestData, saveTestData } from '../../support/loadTestData';


function login(email,password){
    cy.get('input[placeholder="Correo electrónico"]').as('email')
    cy.get('@email').should('be.visible')
    cy.get('@email').type(email)
    
    cy.get('input[placeholder="Contraseña"]').as('password')
    cy.get('@password').should('be.visible')
    cy.get('@password').type(password)
    
    cy.contains('Entrar').should('be.visible')
    cy.intercept('POST', `**/api/v1/auth/sign_in`).as('login')
    cy.contains('Entrar').click()
    cy.wait('@login').then((interception) => {
        cy.log(interception)
    })
}

describe('Login CIUDADANO con credenciales falsas', () => {

    before(() => { 
        loadTestData();
    });

    beforeEach(() => {
        cy.visit(environment.ciudadanoURL);
    });

    it(" Login falso '-- ", () => {

        const email = "manuel@agilgob.com'--";
        const password = '12345678';
        login(email,password);
    
    });

    it(" Login falso admin - admin ", () => {

        const email = "admin";
        const password = 'admin';
        login(email,password);
    
    });

    it(" Login falso root - root ", () => {

        const email = "root";
        const password = 'root';
        login(email,password);
    
    });

    it(" Login falso admin - 12345678 ", () => {

        const email = "admin";
        const password = '12345678';
        login(email,password);
    
    });


    it(" Login falso root - 12345678 ", () => {

        const email = "root";
        const password = '12345678';
        login(email,password);
    
    });


    it(" Login falso manuel@agilgob.com - 12345678 OR 1=1-- ", () => {

        const email = "admmanuel@agilgob.com";
        const password = '12345678 OR 1=1--';
        login(email,password);
    
    });
});
    // 
    // "admin@example.com' --"
    // "'admin@example.com' OR 1=1--"
    