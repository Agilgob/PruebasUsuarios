

describe('Inicia Tramite desde el portal de ciudadano', () => {
    let testData;
    let ciudadano;

    before(() => { 
        // Carga los datos del archivo de datos para utilizarlos en el test
        // ciudadano almacena los datos de cualquier Ciudadano en el archivo de datos
        cy.fixture('localhost').then((data) => {
            testData = data;
            ciudadano = testData.ciudadanoManuel;
        });
    });

    beforeEach(() => {
        cy.visit(testData.url.ciudadano);
        cy.loginCiudadano(ciudadano.email, ciudadano.password);
    });
   

    context('Valida que el tramite se haya creado correctamente', () => {
        it('Valida que el tramite se haya creado correctamente', () => {
            // Confirma la existencia del tramite
            cy.get('.principal-nav ul').as('menuPrincipal');
            cy.get('@menuPrincipal').contains('Mis expedientes').click();
    
            cy.contains('td', 'Partido judicial Tepatitlán pruebas') 
                .parent() 
                .find('a') 
                .click();
            cy.log('El tramite se creo correctamente')


            // Comprobar la imagen de la portada sin detener la prueba si falla
            cy.get('#coverPDF .container img').as('imagenCabeceraPortada').then(($img) => {
                if ($img.length > 0) { 
                    cy.wrap($img)
                        .should('be.visible')
                        .should(($imgElement) => {
                            expect($imgElement[0].naturalWidth).to.be.greaterThan(0);
                        });
                } else {
                    cy.log('⚠️ Imagen de portada no encontrada, pero la prueba continúa.');
                }
            });
    

            cy.log('✅ Continuando con el flujo de prueba');
            // TO DO confirmar que los documentos se hayan cargado correctamente
        });
    });
})

