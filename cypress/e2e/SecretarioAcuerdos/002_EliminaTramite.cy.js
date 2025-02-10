describe('Gestión de trámites', () => {
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

    describe('Eliminar trámites', () => {


        it('Elimina todos los trámites en la tabla', () =>{

            cy.get('.one_column .fa-align-justify').click();
            cy.get('[title="Sección de trámites"]').click();
            cy.get('.principal-nav > .container').as('barraMenuTramites');
        
            cy.screenshot('Se deben cancelar todos los trámites de la tabla');
            cy.get('@barraMenuTramites').contains('Trámites iniciados').click();
            cy.wait(4000)
        
            eliminarTramite();
        
            function eliminarTramite() {
                cy.get('.table.table-bordered').then(($table) => {
                    if($table.children().length > 1){
    
                        cy.get('.table.table-bordered tbody tr').then(($rows) => {
                            if ($rows.length > 0) {
                                cy.get('td .trash').first().click(); // Clic en el primer icono de eliminación
                
                                cy.get('.modal-dialog button')
                                    .contains('Eliminar')
                                    .should('be.visible')
                                    .click()
                                    .then(() => {
                                        cy.wait(1000);
                                        eliminarTramite(); // Llamado recursivo para eliminar el siguiente elemento
                                    });
                            } else {
                                cy.log('No hay más trámites para eliminar');
                                done(); // Finalizar la prueba exitosamente
                            }
                        });
    
                    }else{
                        cy.log('No hay trámites en la tabla');
                        return
                    }
                })
            
            }   
    
        });
        
    })
});
