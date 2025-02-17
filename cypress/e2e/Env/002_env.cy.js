describe('Inicia Tramite desde el portal de ciudadano', () => {
  

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


    it('should visit the environment page', () => {
    
        cy.log(`CIUDADANO : ${ciudadano.email}`)

        cy.log(`TRAMITE NOMBRE: ${tramite.nombre}`)
        cy.log(`TRAMITE PARTIDO JUDICIAL: ${tramite.partidoJudicial}`)
        cy.log(`TRAMITE MATERIA: ${tramite.materia}`)
        cy.log(`TRAMITE CLAVE TIPO JUICIO: ${tramite.claveTipoJuicio}`)

        cy.log(`TESTDATA : ${testData}`)
        
    });

    it('Lee los json en un archivo', () => {

        let retrievedTestData = {}; 
        
        cy.readFile('tmp/testData.json', testData).then((data) => {
            retrievedTestData = data
            console.log(retrievedTestData)
        });
    })

});