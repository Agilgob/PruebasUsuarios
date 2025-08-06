
import 'cypress-wait-until';
export default class PageLogin {
    constructor(){}

    inputEmail = () => cy.get('input[placeholder="Correo electrónico"]');

    inputPassword = () => cy.get('input[placeholder="Password"]');

    buttonLogin = () => cy.contains('Ingresar');

    aForgotPassword = () => cy.get('a[href="/forgot_password"]')

    h4Subtitle = () => cy.get('h4.subtitle');

    h3Title = () => cy.get('h3');

    divBackground = () => cy.get('div[class*="bg-size-cover"]');
}

export class PageLoginCommands extends PageLogin {

    constructor(){
        super();
    }

    catchLoginInterception(loginButton){
        cy.intercept('POST', `**/api/v1/auth/sign_in`).as('loginInterception');
        loginButton.click();
        return cy.wait('@loginInterception').then((interception) => {
            return interception;
        });
    }

    loginFunctionary(email, password, environment){
        cy.visit(environment.funcionarioURL);
        this.inputEmail().scrollIntoView().should('be.visible').type(email);
        this.inputPassword().scrollIntoView().should('be.visible').type(password);

        this.catchLoginInterception(this.buttonLogin()).then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
        });
    }

    createSessionFunctionary(email, password, environment, sessionName = 'sessionFunctionary'){
        cy.session(sessionName, () => {
            this.loginFunctionary(email, password, environment, sessionName);
            cy.waitUntil(() => cy.getCookie('authentication_token_03').then(cookie => Boolean(cookie && cookie.value), {
                timeout: 10000,
                interval: 500,
                errorMsg: 'Authentication token not found after 10 seconds'
            }));
            cy.getCookie('authentication_token_03', { timeout: 5000 }).should('exist');

        }, {
            cacheAcrossSpecs: false
        });
    }
}




