import { loadTestData, saveTestData } from '../../support/loadTestData';


const environment = Cypress.env('environment');
const ciudadano = Cypress.env('ciudadano');
let tramite = null;

describe('Descarga el manual de usuario de los tramites en la primer pantalla', () => {

    before(() => { 
        cy.fixture('tramites.json').then((tramites) => {
            tramite = tramites["di-rep-abog-demandado-anexo"];
        })
    });

    beforeEach(() => {
        cy.session('ciudadano', () => {
            cy.visit(environment.ciudadanoURL);
            cy.loginCiudadano(ciudadano.email, ciudadano.password);
            cy.wait(2000);
            cy.getCookie('authentication_token_02').should('exist');
        });
    });

    function iniciarTramite(){
        expect(tramite.nombre).to.be.equal('Juzgados Civiles, Familiares y Mercantiles en línea');

        cy.visit(environment.ciudadanoURL);
        
        // Ir a tramites disponibles
        cy.get('.principal-nav  ul').as('menuPrincipal');
        cy.get('@menuPrincipal').contains('Trámites disponibles').click();

        // Verifica que existan trámites disponibles
        cy.get('.procedure-card').should('have.length.greaterThan', 0);

        // Buscar un trámite
        cy.get('#searcher').type(tramite.nombre);
        cy.get('i.ti-search')
            .parent()
            .should('be.visible')
            .and('be.enabled')
            .click();

        cy.get('.procedure-card').filter(`:contains("${tramite.nombre}")`).first().as('tramite');
        cy.get('@tramite').contains('button', 'Ir al trámite').click();


        // Iniciar tramite
        cy.contains('button', 'Iniciar trámite')
            .should('be.visible')
            .and('be.enabled')
            .click();
    }


    it('Apellido del demandado se oculta cuando no se quiere agregar demandado', () => {
        iniciarTramite();
        // DEMANDADO
        cy.llenarSelect('Para este caso, ¿Es necesario agregar demandado?', 'Si');
        cy.llenarSelect('¿El demandado es persona física o moral?', 'Fisica');
        cy.llenarSelect('Para este caso, ¿Es necesario agregar demandado?', 'No');

        cy.screenshot('Persona Fisica')
        
        cy.get('input[id="inputForm.apellido_paternod"]').then(($input) => {
            cy.log('Cantidad de elementos encontrados' + $input.length)
            expect($input).to.have.length(0)
            expect($input).to.not.exist

        })
    })

    it('La razon social del demandado se oculta cuando no se quiere agregar demandado', () => {
        iniciarTramite();
        // DEMANDADO
        cy.llenarSelect('Para este caso, ¿Es necesario agregar demandado?', 'Si');
        cy.llenarSelect('¿El demandado es persona física o moral?', 'Moral');
        cy.llenarSelect('Para este caso, ¿Es necesario agregar demandado?', 'No');

        cy.screenshot('Persona Moral')
        
        cy.get('input[id="inputForm.razon_social_demandado"]').then(($input) => {
            cy.log('Cantidad de elementos encontrados' + $input.length)
            expect($input).to.have.length(0)
            expect($input).to.not.exist

        })
    })

})