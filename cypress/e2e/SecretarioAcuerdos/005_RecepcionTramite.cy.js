
describe('Recepción de Trámite', () => {

    let testData;
    let ciudadano;
    let tramite;
    let funcionario;

    before(() => { 
        // Carga los datos del archivo de datos para utilizarlos en el test
        // ciudadano almacena los datos de cualquier Ciudadano en el archivo de datos

        const ciudadanoEnv = Cypress.env('ciudadano');
        const tramiteEnv = Cypress.env('tramite');
        const testDataEnv = Cypress.env('testData');
        const funcionarioEnv = Cypress.env('funcionario');

        cy.log(`CIUDADANO ENV : ${ciudadanoEnv}`)
        cy.log(`TRAMITE ENV : ${tramiteEnv}`)
        cy.log(`TESTDATA ENV FILE: ${testDataEnv}`)
        cy.log(`FUNCIONARIO ENV : ${funcionarioEnv}`)


        cy.fixture(testDataEnv).then((data) => {
            testData = data;
        });

        cy.fixture('ciudadanos').then((data) => {
            ciudadano = data[ciudadanoEnv];
        });

        cy.fixture('tramites').then((data) => {
            tramite = data[tramiteEnv];
        });

        cy.fixture('funcionarios').then((data) => {
            funcionario = data[funcionarioEnv];
        })

    });

    beforeEach(() => {
        cy.session('sesionFuncionario', () => {
            cy.clearCookies();
            cy.clearLocalStorage();
            cy.visit(testData.funcionarioURL);
            cy.loginFuncionario(funcionario.email, funcionario.password);
            cy.wait(2000);
            cy.getCookie('authentication_token_03', { timeout: 5000 }).should('exist');
        }, {
            cacheAcrossSpecs: true // Ensures session is persisted across test files
        });
    });

    
    it('El expediente puede ser localizado desde el buscador', () => {
        // Navegar a la página inicial
        cy.visit(testData.funcionarioURL);
    
        // Abrir menú lateral y navegar a la sección de búsqueda de expedientes
        cy.hamburguer().click();
        cy.sidebar('Expedientes').click();
        cy.sidebarExpedientes('Buscar expediente').click();
    
        // Buscar expediente
        cy.get('.searcherContainer .inputSearcher').type(tramite.expediente);
        cy.contains('.buttonsSearch button', "Buscar").click();
    
        cy.contains('tr td a', tramite.expediente).parent().parent().as('expedienteEncontrado');
        cy.get('@expedienteEncontrado').contains(funcionario.nombre).should('exist');
        cy.get('@expedienteEncontrado').find('td a').click();
    
        // Esperar a que la URL cambie dinámicamente
        cy.url().should('include', '/expedient_details/').then((currentUrl) => {
            cy.log(currentUrl); // Muestra la URL en los logs de Cypress
            tramite.url = currentUrl; // Guarda la URL en la variable `tramite`
        });

    });
    

    // it("Los botones de accion son accesibles para el funcionario", () => {
    //     cy.visit(tramite.url, {failOnStatusCode: false});
    //     cy.get('section[class^="ExpedientActions_actions"]').as('accionesExpediente');
    //     cy.get('@accionesExpediente').should('be.visible');

    //     const acciones = ['Imprimir carátula', 'Turnar expediente', 'Indicadores', 'Permisos de expediente', 'Agregar documento',
    //         'Ver expediente completo', 'Descarga expediente', 'Generar código QR', 'Listar Partes'
    //     ];

    //     cy.log(`BOTONES DE ACCION ${acciones}`)

    //     acciones.forEach((accion) => {
    //         cy.get('@accionesExpediente').get('button').filter(`:contains("${accion}")`).first().as('imprimirCaratula');
    //         cy.get('@imprimirCaratula')
    //             .should('be.visible')
    //             .and('be.enabled')
    //             .and('have.descendants', 'i');
    //     })
    // })


    it("Acuerdos, notificaciones, sentencias correos y oficios son accesibles", () => {
        cy.visit(tramite.url, { failOnStatusCode: false });
    
        const tabs = ['Acuerdos', 'Notificaciones', 'Sentencias', 'Correos', 'Oficios'];
    
        cy.get('[class^="Tabs_tabs"][data-rttabs="true"]').should('be.visible').as('tabsTabs');
        cy.get('@tabsTabs').should('have.descendants', 'ul');
    
        tabs.forEach(($tab) => { // Corrected usage of forEach
            cy.get('@tabsTabs').contains('li', $tab).should('be.visible').click();
            cy.log(`TAB ${$tab} SELECCIONADO`);
    
            cy.get('@tabsTabs')
                .find('div section[class^="TemplateTabs_tabPanelContent"]') // section con botón de acción
                .should('be.visible')
                .and('have.descendants', 'button')
                .find('button[class^="ActionWidget_actionWidget"]') // botón de acción
                .should('be.visible')
                .and('be.enabled')
                .and('have.descendants', 'i')
                .and('have.descendants', 'span')
                .find('span')
                .then(($span) => {
                    cy.wrap($span).invoke('text').should('not.be.empty'); // Corrected assertion for text check
                    cy.log(`BOTON DE ACCION EN TAB ${$tab} ACCESIBLE TEXTO ${$span.text()}`);
                });
            cy.wait(1000)
        });
    });
    

    // it('El expediente permite agregar documento Promocion', () => {

    //     // Agregar documento Promocion
        
    //     cy.visit(tramite.url, {failOnStatusCode: false});
    //     cy.get('section[class^="ExpedientActions_actions"]').as('accionesExpediente');
    //     cy.get('@accionesExpediente').get('button').filter(':contains("Agregar documento")').first().click();
    //     cy.get('.modal-dialog', {'timeout':2000}).filter(':contains("Nuevo documento")').first().as('modalAgregarDocumento');
    //     cy.get('@modalAgregarDocumento').should('be.visible');
    //     cy.get('@modalAgregarDocumento').find('.select-body-modal__control').click()
    //     cy.get('@modalAgregarDocumento').find('.select-body-modal__menu').contains('Promoción').click()

    //         // Agregar firma
    //         cy.get('@modalAgregarDocumento').contains('button', 'Agregar Firma').click();

    //         // Agregar archivo .pfx en modal Firma Electronica
    //         cy.get('div .modal-dialog').filter(':contains("Firma Electronica")').first().as('modalFirmaElectronica');
    //         cy.get('@modalFirmaElectronica').should('be.visible');
    //         cy.get('@modalFirmaElectronica').contains('button', 'Agregar Archivo')
    //             .siblings('input').selectFile( funcionario.archivoFirel , { force: true });
    //         cy.get('@modalFirmaElectronica').get('input[placeholder="Password"]').type(funcionario.passwordFirel);
    //         // cy.get('@modalFirmaElectronica').contains('button', 'Agregar').click(); // TO DO habilitar
    //         cy.get('@modalFirmaElectronica').contains('button', 'Cancelar').click();

    //     cy.get('@modalAgregarDocumento').get('input[placeholder="Agrega una etiqueta para identificar este documento"]')
    //         .type(tramite.identificadorDocumento);
    //     cy.get('@modalAgregarDocumento').get('textarea[aria-label="Comentarios"]')
    //         .type(tramite.comentarioDocumento);
        
    //     cy.get('#fileInputNewDocuemnt') // Asegura que el selector sea correcto
    //         .should('have.attr', 'type', 'file')
    //         .and('have.attr', 'accept', '.pdf, .doc, .docx')
    //         .and('not.be.visible')
    //         .and('be.enabled')
    //         .selectFile(testData.documentoPDF, { force: true });
    //     cy.wait(2000)

    //     cy.get('@modalAgregarDocumento').find('[aria-label="Nombre del promovente"]')
    //         .type(funcionario.nombre);
        
    //     cy.get('@modalAgregarDocumento')
    //         .get('.form-group')
    //         .contains('label', '¿Quieres agregar anexos?')
    //         .parent()
    //         .find(`.form-check-input#${tramite.agregarAnexos}`) // input de opciones
    //         .click()
        
    //     cy.get('@modalAgregarDocumento').contains('button', 'Cancelar').click();
    //     // cy.get('@modalAgregarDocumento').contains('button', 'Firmar').click(); TO DO habilitar
    // });

});