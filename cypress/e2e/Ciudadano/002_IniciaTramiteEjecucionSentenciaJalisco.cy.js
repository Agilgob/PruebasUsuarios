

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
    
    context('Inicia un tramite y concluye la creacion', () => {
        it('Inicia un trámite y concluye la creacion', () => {
            // Ir a tramites disponibles
            cy.get('.principal-nav  ul').as('menuPrincipal');
            cy.get('@menuPrincipal').contains('Trámites disponibles').click();
    
            // Verifica que existan trámites disponibles
            cy.get('.procedure-card').should('have.length.greaterThan', 0);
    
            // Buscar un trámite
            cy.get('#searcher').type(ciudadano.tramite);
            cy.get('i.ti-search')
                .parent()
                .should('be.visible')
                .and('be.enabled')
                .click();

            cy.get('.procedure-card').filter(`:contains("${ciudadano.tramite}")`).first().as('tramite');
            cy.get('@tramite').contains('button', 'Ir al trámite').click();

            // Iniciar tramite
            cy.contains('button', 'Iniciar trámite')
                .should('be.visible')
                .and('be.enabled')
                .click();

            // Llenado de Demanda Inicial
            const fecha = new Date();
            const fechaLocal = fecha.toLocaleDateString('es-MX', { timeZone: 'America/Mexico_City' }).split('/').reverse().join('-'); 
            cy.log(`FECHA: ${fecha}, FECHA LOCAL: ${fechaLocal}`); // REVIEW corroborar que la fecha sea correcta

            // Verifica que el input tiene el valor esperado y que está deshabilitado
            cy.get('input[name="fecha_de_presentacion"]').as('fechaPresentacion');
            cy.get('@fechaPresentacion').should('be.disabled');
            cy.get('@fechaPresentacion').should('have.attr', 'value')
            .then((val) => {
                expect(val).to.equal(fechaISO);
            })
            

            cy.llenarSelect('Partido Judicial', 'Partido Judicial Tepatitlan');
            cy.llenarSelect('Materia', 'Familiar');
            cy.llenarSelect('Clave del tipo de juicio', 'Ejecución de Sentencia Jalisco');
            cy.llenarSelect('Tipo de Vía', 'Juicio Civil Ejecutivo')
            cy.llenarSelect('Elige el regimén del Actor o Promovente', 'Fisica')
            cy.llenarSelect('¿Existe representante legal para el actor?', 'No')
            cy.llenarSelect('¿Existe abogado patrono para el actor?', 'No')

            cy.get('button').contains('Agregar Firma').click()
            cy.cargarArchivoFirel(ciudadano.archivoFirel, ciudadano.passwordFirel);
            
            cy.cargarDocumento('Agregar Archivo', testData.documentoPDF)
            cy.wait(5000)
            cy.contains('button', 'Firmar').should('be.visible').and('be.enabled').click();
            cy.llenarSelect('Para este caso, ¿Es necesario agregar demandado?', 'No')

            cy.contains('button', 'Siguiente').click(); 
            cy.contains('button', 'Confirmar', {timeout:15000}).click();

        })
    })

})

