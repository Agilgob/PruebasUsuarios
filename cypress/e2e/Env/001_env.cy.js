import { PageLoginCommands } from "../../page/functionary/PageLogin";

const environment = Cypress.env('environment');
const funcionario = Cypress.env('funcionario');


describe('Inicia Tramite desde el portal de ciudadano', () => {

    let testData;
    let tramite;

    // before(() => {
        
    //     cy.readFile('tmp/testData.json', { log: false, timeout: 500 }).then((data) => {
    //       testData = data;
    //       tramite = testData.tramite;
    //     })

    // });

    beforeEach(() => {
        cy.on("uncaught:exception", (err, runnable) => {
            cy.log(err.message);
            return false;
        })
        const pageLogin = new PageLoginCommands();
        pageLogin.createSessionFunctionary(funcionario.email, funcionario.password, environment, funcionario.email);

    });
    
    
    it('debe cargar las variables de entorno', () => {
        cy.visit(environment.funcionarioURL);
        cy.wait(2000);

    })

})

