import { loadTestData, saveTestData } from '../../support/loadTestData';

describe('Descarga el manual de usuario de los tramites en la primer pantalla', () => {


    before(() => { 
        loadTestData();
    });

    beforeEach(() => {
        cy.session('ciudadano', () => {
            cy.visit(environment.ciudadanoURL);
            cy.loginCiudadano(ciudadano.email, ciudadano.password);
            cy.wait(2000);
            cy.getCookie('authentication_token_02').should('exist');
        });
    });

    context("Descarga el manual de usuario de los tramites en Tramites Disponibles pag=1", () => {
        it('Inicia un trámite y concluye la creacion', () => {
            // Ir a tramites disponibles
            cy.visit(environment.ciudadanoURL);
            cy.get('.principal-nav  ul').as('menuPrincipal');
            cy.get('@menuPrincipal').contains('Trámites disponibles').click();
    
            // Verifica que existan trámites disponibles
            cy.get('.procedure-card').as('tarjetasTramite')
            cy.get('@tarjetasTramite').should('have.length.greaterThan', 0);

            cy.intercept('GET', `${environment.modeladorURL}api/v1/procedure/manual/*`).as('descargaManualUsuario');
            cy.get('@tarjetasTramite').each((tarjeta) => {
                cy.screenshot('DescargaManualUsuarioTramite')
                cy.wrap(tarjeta).find('.secondary').click()
                cy.wait('@descargaManualUsuario').then((interception) => {
                    expect(interception.response.statusCode).to.eq(200);
                });

            });
            
        });
    });
})



cy.get('form.form-signin input[name="Password"]').as('loginForm');
cy.get('@loginForm').find('input[name="Password"]').type(email);
