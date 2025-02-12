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
        // cy.hamburguer().click();
        // cy.screenshot('menuHamburguesa');
        // cy.sidebar('Expedientes').click();
        // cy.sidebarExpedientes('Expedientes enviados').click()

        // // Expedientes enviados 
        // cy.get('.searcherContainer .inputSearcher').type(tramite.expediente);
        // cy.contains('.buttonsSearch button ', "Buscar").click();
        
        // cy.contains('div .message', 'No se han encontrado resultados').then((message) => {
        //     cy.log(message.text())
        // })

        cy.hamburguer().click(); 
        cy.sidebar('Expedientes').click();  
        cy.sidebarExpedientes('Buscar expediente').click();
        cy.get('.searcherContainer .inputSearcher').type(tramite.expediente);
        cy.contains('.buttonsSearch button ', "Buscar").click();
        cy.contains('tr td a', tramite.expediente).parent().parent().as('expedienteEncontrado');
        cy.get('@expedienteEncontrado').contains(funcionario.nombre).should('exist');

        ```
        TO DO :
        abrir expediente
        click agregar documento 
        seleccionar tipo de documento : promocion
        click agregar firma 
            agregar archivo firel (.pfx)
            ingresar contrasena
            click Agregar

        Escribir etiqueta de l documento 
        click seleccionar documento (para cargarlo)
        ingresar nombre del promovente 
        agregar anexo : [si/no]
            si :
                click agregar anexo
                selecciona tipo de anexo 
                ingresa etiqueta 
                selecciona documento para cargar
                click agregar
            
        Firmar

        .ExpedientActions_actions

        ```


    });

});