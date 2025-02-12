
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
        cy.visit(testData.funcionarioURL);
        cy.loginFuncionario(funcionario.email, funcionario.password);

    });

    it('El expediente puede ser localizado desde el buscador', () => {

        // Buscar expediente en 'Buscar expediente'
        cy.hamburguer().click(); 
        cy.sidebar('Expedientes').click();  
        cy.sidebarExpedientes('Buscar expediente').click();
        cy.get('.searcherContainer .inputSearcher').type(tramite.expediente);
        cy.contains('.buttonsSearch button ', "Buscar").click();
        cy.contains('tr td a', tramite.expediente).parent().parent().as('expedienteEncontrado');
        cy.get('@expedienteEncontrado').contains(funcionario.nombre).should('exist');


        // Ingresar en el expediente
        cy.get('@expedienteEncontrado').get('td a').click();

        cy.get('section[class^="ExpedientActions_actions"]').as('accionesExpediente');

        const acciones = ['Imprimir carátula', 'Turnar expediente', 'Indicadores', 'Permisos de expediente', 'Agregar documento',
            'Ver expediente completo', 'Descarga expediente', 'Generar código QR', 'Listar Partes'
        ];

        acciones.forEach((accion) => {
            cy.get('@accionesExpediente').get('button').filter(`:contains("${accion}")`).first().as('imprimirCaratula');
            cy.get('@imprimirCaratula')
                .should('be.visible')
                .and('be.enabled')
                .and('have.descendants', 'i');
        })

        cy.wait(1000)

        // Agregar documento Promocion
        cy.get('@accionesExpediente').get('button').filter(':contains("Agregar documento")').first().click();
        cy.get('.modal-dialog', {'timeout':2000}).filter(':contains("Nuevo documento")').first().as('modalAgregarDocumento');
        cy.get('@modalAgregarDocumento').should('be.visible');
        cy.get('@modalAgregarDocumento').find('.select-body-modal__control').click()
        cy.get('@modalAgregarDocumento').find('.select-body-modal__menu').contains('Promoción').click()

            // Agregar firma
            cy.get('@modalAgregarDocumento').contains('button', 'Agregar Firma').click();

            // Agregar archivo .pfx en modal Firma Electronica
            cy.get('div .modal-dialog').filter(':contains("Firma Electronica")').first().as('modalFirmaElectronica');
            cy.get('@modalFirmaElectronica').should('be.visible');
            cy.get('@modalFirmaElectronica').contains('button', 'Agregar Archivo')
                .siblings('input').selectFile( funcionario.archivoFirel , { force: true });
            cy.get('@modalFirmaElectronica').get('input[placeholder="Password"]').type(funcionario.passwordFirel);
            // cy.get('@modalFirmaElectronica').contains('button', 'Agregar').click(); // TO DO habilitar
            cy.get('@modalFirmaElectronica').contains('button', 'Cancelar').click();

        cy.get('@modalAgregarDocumento').get('input[placeholder="Agrega una etiqueta para identificar este documento"]')
            .type(tramite.identificadorDocumento);
        cy.get('@modalAgregarDocumento').get('textarea[aria-label="Comentarios"]')
            .type(tramite.comentarioDocumento);
        
        cy.get('#fileInputNewDocuemnt') // Asegura que el selector sea correcto
            .should('have.attr', 'type', 'file')
            .and('have.attr', 'accept', '.pdf, .doc, .docx')
            .and('not.be.visible')
            .and('be.enabled')
            .selectFile(testData.documentoPDF, { force: true });
        cy.wait(2000)

        cy.get('@modalAgregarDocumento').find('[aria-label="Nombre del promovente"]')
            .type(funcionario.nombre);
        
        cy.get('@modalAgregarDocumento')
            .get('.form-group')
            .contains('label', '¿Quieres agregar anexos?')
            .parent()
            .find(`.form-check-input#${tramite.agregarAnexos}`) // input de opciones
            .click()
        
        cy.get('@modalAgregarDocumento').contains('button', 'Cancelar').click();
        // cy.get('@modalAgregarDocumento').contains('button', 'Firmar').click(); TO DO habilitar


    });

});