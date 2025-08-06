export default class PageLogin {
    constructor(){}

    inputEmail = () => cy.get('input[placeholder="Correo electrónico"]');

    inputPassword = () => cy.get('input[placeholder="Password"]');

    buttonLogin = () => cy.contains('Ingresar');

}

export class PageLoginCommands extends PageLogin {

    constructor(){
        super();
    }

    catchLoginInterception( loginButton ){
        cy.intercept('POST', `**/api/v1/auth/sign_in`).as('loginInterception')
        loginButton.click();
        return cy.wait('@loginInterception').then((interception) => {
            return interception;
        })
    }

};


export function loginFunctionary(email, password, environment){
    const pageLogin = new PageLoginCommands();
    cy.visit(environment.funcionarioURL);
    pageLogin.inputEmail().scrollIntoView().should('be.visible').type(email);
    pageLogin.inputPassword().scrollIntoView().should('be.visible').type(password);

    const pageLoginCommands = new PageLoginCommands();
    pageLoginCommands.catchLoginInterception( pageLogin.buttonLogin() ).then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
    })
};

export function createSessionFunctionary(email, password, environment, sessionName = 'sessionFunctionary'){
   cy.session(sessionName, () => {
       loginFunctionary(email, password, environment, sessionName);
    }, {
        cacheAcrossSpecs: false
    });
}

