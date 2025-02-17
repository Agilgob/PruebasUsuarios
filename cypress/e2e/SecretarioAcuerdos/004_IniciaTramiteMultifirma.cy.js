describe('Gestión de trámites', () => {
    let testData;
    let funcionario;

    before(() => { 
        // Carga los datos del archivo de datos para utilizarlos en el test
        // funcionario almacena los datos de cualquier funcionario en el archivo de datos
        cy.fixture('localhost').then((data) => {
            testData = data;
            funcionario = testData.secretarioAcuerdos;
        });
    });

    beforeEach(() => {
        cy.visit(testData.url.funcionario);
        cy.loginFuncionario(funcionario.email, funcionario.password);
    });
    
  
});

