
import { PageLoginCommands } from "../../page/functionary/PageLogin"

Cypress.Commands.add('loginFuncionario', (email, password) => {
    const pageLogin = new PageLoginCommands();
    pageLogin.createSessionFunctionary(email, password, Cypress.env('environment'), email);
})


Cypress.Commands.add('iniciarSesionFuncionario', (email, password, environment) => {
    const pageLogin = new PageLoginCommands();
    pageLogin.loginFunctionary(email, password, environment);
});
