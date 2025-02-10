describe('Inicia Tramite desde el portal de ciudadano', () => {
  
    let testData;
    let ciudadano;
    let tramite;

    before(() => { 
        // Carga los datos del archivo de datos para utilizarlos en el test
        // ciudadano almacena los datos de cualquier Ciudadano en el archivo de datos
        cy.fixture('testDataSandbox').then((data) => {
            testData = data;
        });

        cy.fixture('ciudadanos').then((data) => {
            const ciudadanoEnv = Cypress.env('ciudadano');
            cy.log(`CIUDADANO ENV: ${ciudadanoEnv}`)
            ciudadano = data[ciudadanoEnv];
        });

        cy.fixture('tramites').then((data) => {
            const tramiteEnv = Cypress.env('tramite');
            cy.log(`TRAMITE ENV : ${tramiteEnv}`)
            tramite = data[tramiteEnv];
        });

    });

    it('should visit the environment page', () => {
    
        cy.log(`CIUDADANO : ${ciudadano.email}`)

        cy.log(`TRAMITE NOMBRE: ${tramite.nombre}`)
        cy.log(`TRAMITE PARTIDO JUDICIAL: ${tramite.partidoJudicial}`)
        cy.log(`TRAMITE MATERIA: ${tramite.materia}`)
        cy.log(`TRAMITE CLAVE TIPO JUICIO: ${tramite.claveTipoJuicio}`)

        cy.log(`TESTDATA : ${testData}`)
        
    });

});